import axios from 'axios';

const api = axios.create({
  baseURL: 'https://fraudlens-kgtr.onrender.com/api/v1',
});

export interface FactorContribution {
  feature: string;
  contribution: number;
  direction: string;
}

export interface RiskAssessment {
  risk_score: number;
  risk_level: string;
  fraud_probability: number;
  anomaly_score: number;
  contributing_factors: FactorContribution[];
}

export interface BatchRiskAssessment {
  total_transactions: number;
  low_risk_count: number;
  medium_risk_count: number;
  high_risk_count: number;
  results: any[];
}

export const getHealth = () => api.get('/health');
export const getMetrics = () => api.get('/model/metrics');

export const predictSingle = (data: any) => api.post<RiskAssessment>('/analyze', data);

export const predictBatch = async (file: File) => {
  const text = await file.text();
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  const transactions = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = lines[i].split(',');
    const tx: any = {};
    headers.forEach((h, idx) => {
      tx[h] = parseFloat(values[idx]);
    });
    transactions.push(tx);
  }
  
  return api.post<BatchRiskAssessment>('/analyze-batch', transactions);
};
