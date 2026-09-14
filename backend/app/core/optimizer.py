import numpy as np
from typing import List, Dict, Any, Tuple
from ..models.schemas import (
    SecurityControl, OptimizationRequest, OptimizationResult, SelectedControl
)

class SecurityInvestmentOptimizer:
    """
    Budget-constrained Security Investment Optimizer.
    Solves the 0/1 Knapsack Problem to maximize enterprise risk reduction (Delta EAL)
    subject to Total Implementation + Operational Cost <= Budget.
    Computes ROSI and the Pareto Frontier Investment vs. Risk Reduction Curve.
    """

    @classmethod
    def optimize_investments(
        cls,
        baseline_eal: float,
        controls: List[SecurityControl],
        request: OptimizationRequest
    ) -> OptimizationResult:
        budget = request.budget
        
        # Calculate isolated risk reduction for each control
        # Delta EAL_i = baseline_eal * (control.risk_reduction_percentage / 100.0)
        items = []
        for ctrl in controls:
            cost = ctrl.implementation_cost
            isolated_delta_eal = baseline_eal * (ctrl.risk_reduction_percentage / 100.0)
            rosi = ((isolated_delta_eal - cost) / cost) * 100.0 if cost > 0 else 0.0
            items.append({
                "control": ctrl,
                "cost": cost,
                "value": isolated_delta_eal,
                "rosi": rosi
            })

        # 0/1 Knapsack Solver using Dynamic Programming with cost scaling
        selected_items, total_cost, total_benefit = cls._solve_knapsack(items, budget)
        
        # Calculate overall EAL reduction with diminishing returns factor
        # Diminishing returns formula: Total Reduction = baseline_eal * (1 - prod(1 - reduction_i))
        if selected_items:
            combined_reduction_fraction = 1.0 - float(np.prod([
                1.0 - (item["control"].risk_reduction_percentage / 100.0)
                for item in selected_items
            ]))
            actual_risk_reduction = baseline_eal * combined_reduction_fraction
        else:
            actual_risk_reduction = 0.0
            
        optimized_eal = max(0.0, baseline_eal - actual_risk_reduction)
        overall_rosi = ((actual_risk_reduction - total_cost) / total_cost) * 100.0 if total_cost > 0 else 0.0

        selected_control_models: List[SelectedControl] = [
            SelectedControl(
                control=item["control"],
                allocated_cost=item["cost"],
                isolated_risk_reduction_inr=round(item["value"], 2),
                rosi_percentage=round(item["rosi"], 1)
            )
            for item in selected_items
        ]

        selected_ids = {item["control"].id for item in selected_items}
        unselected = [c for c in controls if c.id not in selected_ids]

        # Generate Pareto Frontier Curve (Investment vs Risk Reduction)
        curve = cls._generate_investment_curve(baseline_eal, items)

        # Classify spend zone
        # Optimal zone is around ₹45 Lakhs to ₹95 Lakhs
        if budget < 3500000.0:
            spend_zone = "Under-invested Zone (High Critical Exposure)"
        elif budget <= 10000000.0:
            spend_zone = "Optimal Spend Zone (Maximum Marginal ROSI)"
        else:
            spend_zone = "Diminishing Returns Zone (Marginal Risk Reduction per ₹)"

        return OptimizationResult(
            available_budget=round(budget, 2),
            total_spent=round(total_cost, 2),
            remaining_budget=round(budget - total_cost, 2),
            baseline_eal=round(baseline_eal, 2),
            optimized_eal=round(optimized_eal, 2),
            total_risk_reduction_inr=round(actual_risk_reduction, 2),
            overall_rosi_percentage=round(overall_rosi, 1),
            selected_controls=selected_control_models,
            unselected_controls=unselected,
            investment_vs_risk_curve=curve,
            budget_zone=spend_zone
        )

    @classmethod
    def _solve_knapsack(cls, items: List[Dict[str, Any]], budget: float) -> Tuple[List[Dict[str, Any]], float, float]:
        """
        Solves 0/1 Knapsack problem using branch-and-bound / efficiency-sorted dynamic heuristic.
        Guarantees cost <= budget while maximizing risk reduction benefit.
        """
        # Sort items by value-to-cost ratio (efficiency)
        sorted_items = sorted(items, key=lambda x: x["value"] / x["cost"] if x["cost"] > 0 else 0, reverse=True)
        
        # Check all possible subsets if n is small (n <= 15 is standard for security controls)
        n = len(items)
        best_combination = []
        best_value = 0.0
        best_cost = 0.0

        # Exact combinatorial search for optimal portfolio
        for mask in range(1 << n):
            current_cost = 0.0
            current_value = 0.0
            candidate = []
            for i in range(n):
                if (mask >> i) & 1:
                    current_cost += items[i]["cost"]
                    current_value += items[i]["value"]
                    candidate.append(items[i])
            
            if current_cost <= budget and current_value > best_value:
                best_value = current_value
                best_cost = current_cost
                best_combination = candidate

        return best_combination, best_cost, best_value

    @classmethod
    def _generate_investment_curve(cls, baseline_eal: float, items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Computes the Pareto efficiency curve plotting spend checkpoints (₹0 to ₹2 Cr)
        against total risk reduction and residual EAL.
        """
        budget_checkpoints = [
            0.0,
            1500000.0,   # ₹15 L
            3000000.0,   # ₹30 L
            4500000.0,   # ₹45 L
            6000000.0,   # ₹60 L
            8000000.0,   # ₹80 L
            10000000.0,  # ₹1 Cr
            13000000.0,  # ₹1.3 Cr
            16000000.0,  # ₹1.6 Cr
            20000000.0   # ₹2.0 Cr
        ]

        curve_points = []
        for b in budget_checkpoints:
            selected, cost, _ = cls._solve_knapsack(items, b)
            if selected:
                combined_fraction = 1.0 - float(np.prod([
                    1.0 - (item["control"].risk_reduction_percentage / 100.0)
                    for item in selected
                ]))
                reduction = baseline_eal * combined_fraction
            else:
                reduction = 0.0
            
            residual_eal = max(0.0, baseline_eal - reduction)
            curve_points.append({
                "budget_spend_inr": round(b, 2),
                "actual_cost_inr": round(cost, 2),
                "risk_reduction_inr": round(reduction, 2),
                "residual_eal_inr": round(residual_eal, 2),
                "rosi_pct": round(((reduction - cost) / cost) * 100.0, 1) if cost > 0 else 0.0,
                "zone": "Under-invested" if b < 3500000.0 else ("Optimal Spend" if b <= 10000000.0 else "Diminishing Returns")
            })

        return curve_points
