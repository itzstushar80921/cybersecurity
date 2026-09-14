import unittest
from app.models.schemas import SimulationRequest, OptimizationRequest, WhatIfRequest
from app.data.sample_enterprise import SAMPLE_ASSETS, SAMPLE_VULNERABILITIES, SAMPLE_SECURITY_CONTROLS
from app.core.fair_engine import FAIRQuantificationEngine
from app.core.monte_carlo import MonteCarloSimulator
from app.core.optimizer import SecurityInvestmentOptimizer
from app.core.compliance import ComplianceCrosswalkEngine
from app.core.copilot import AIRiskCopilot

class TestCyberQuantRiskEngine(unittest.TestCase):
    
    def test_fair_engine_tef_and_vuln(self):
        asset = SAMPLE_ASSETS[0]
        tef = FAIRQuantificationEngine.calculate_tef(asset, threat_multiplier=1.0)
        self.assertGreater(tef, 0.0)
        
        vuln = FAIRQuantificationEngine.calculate_vulnerability(asset, SAMPLE_VULNERABILITIES)
        self.assertGreaterEqual(vuln, 0.0)
        self.assertLessEqual(vuln, 1.0)

    def test_monte_carlo_simulation(self):
        req = SimulationRequest(iterations=1000)
        result = MonteCarloSimulator.run_simulation(
            SAMPLE_ASSETS, SAMPLE_VULNERABILITIES, SAMPLE_SECURITY_CONTROLS, req
        )
        self.assertGreater(result.expected_annual_loss, 0)
        self.assertGreater(result.value_at_risk_95, result.expected_annual_loss)
        self.assertGreaterEqual(result.value_at_risk_99, result.value_at_risk_95)
        self.assertEqual(len(result.loss_exceedance_curve), 13)
        self.assertEqual(len(result.asset_risk_rankings), len(SAMPLE_ASSETS))

    def test_investment_knapsack_optimizer(self):
        baseline_eal = 80000000.0  # ₹8 Crores
        budget = 10000000.0        # ₹1 Crore
        req = OptimizationRequest(budget=budget)
        
        opt_res = SecurityInvestmentOptimizer.optimize_investments(
            baseline_eal, SAMPLE_SECURITY_CONTROLS, req
        )
        self.assertLessEqual(opt_res.total_spent, budget)
        self.assertGreater(opt_res.total_risk_reduction_inr, 0)
        self.assertLess(opt_res.optimized_eal, baseline_eal)
        self.assertGreater(opt_res.overall_rosi_percentage, 0)
        self.assertGreater(len(opt_res.selected_controls), 0)

    def test_compliance_framework_scores(self):
        scores = ComplianceCrosswalkEngine.get_framework_scores()
        self.assertGreaterEqual(len(scores), 4)
        for fw in scores:
            self.assertGreaterEqual(fw.overall_compliance_percentage, 0.0)
            self.assertLessEqual(fw.overall_compliance_percentage, 100.0)

    def test_copilot_natural_language_query(self):
        sim = MonteCarloSimulator.run_simulation(
            SAMPLE_ASSETS, SAMPLE_VULNERABILITIES, SAMPLE_SECURITY_CONTROLS, SimulationRequest(iterations=500)
        )
        opt = SecurityInvestmentOptimizer.optimize_investments(
            sim.expected_annual_loss, SAMPLE_SECURITY_CONTROLS, OptimizationRequest(budget=10000000.0)
        )
        scores = ComplianceCrosswalkEngine.get_framework_scores()
        
        res = AIRiskCopilot.answer_query("What is our highest financial cyber risk?", sim, opt, scores)
        self.assertIn("Highest Financial Exposure", res.answer)
        self.assertGreater(len(res.suggested_followups), 0)

if __name__ == "__main__":
    unittest.main()
