const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

export interface FactorContribution {
  feature: string;
  contribution: number;
  direction: string;
}

export interface RiskAssessment {
  risk_score: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  fraud_probability: number;
  anomaly_score: number;
  contributing_factors: FactorContribution[];
}

export interface BatchRiskAssessment {
  total_transactions: number;
  low_risk_count: number;
  medium_risk_count: number;
  high_risk_count: number;
  results: {
    transaction: any;
    assessment: RiskAssessment;
  }[];
}

export const analyzeTransaction = async (transaction: any): Promise<RiskAssessment> => {
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(transaction),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to analyze transaction');
  }

  return response.json();
};

export const getMetrics = async (): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/model/metrics`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch metrics');
  }

  return response.json();
};

export const analyzeBatch = async (transactions: any[]): Promise<BatchRiskAssessment> => {
  const response = await fetch(`${API_BASE_URL}/analyze-batch`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(transactions),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to analyze batch');
  }

  return response.json();
};
