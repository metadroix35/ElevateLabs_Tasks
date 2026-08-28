import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
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

export const predictSingle = (data: any) => api.post<RiskAssessment>('/predict', data);

export const predictBatch = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post<BatchRiskAssessment>('/predict/batch', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
