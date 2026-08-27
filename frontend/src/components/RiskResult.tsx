import React from 'react';
import type { RiskAssessment } from '../services/api';
import { AlertCircle, AlertTriangle, CheckCircle, Activity, ShieldAlert } from 'lucide-react';

interface Props {
  assessment: RiskAssessment | null;
  loading: boolean;
  error: string | null;
}

export const RiskResult: React.FC<Props> = ({ assessment, loading, error }) => {
  if (loading) {
    return <div className="surface" style={{ textAlign: 'center', padding: '3rem' }}>Analyzing transaction...</div>;
  }

  if (error) {
    return (
      <div className="surface" style={{ borderColor: 'red', backgroundColor: '#fff5f5' }}>
        <h3 style={{ color: 'red', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={20} /> Error
        </h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!assessment) return null;

  const isHigh = assessment.risk_level === 'HIGH';
  const isMedium = assessment.risk_level === 'MEDIUM';
  const color = isHigh ? '#d32f2f' : isMedium ? '#f57c00' : '#388e3c';
  const Icon = isHigh ? ShieldAlert : isMedium ? AlertTriangle : CheckCircle;

  return (
    <div className="surface">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <Icon size={32} color={color} />
        <div>
          <h2 style={{ margin: 0, color }}>{assessment.risk_level} RISK</h2>
          <span style={{ color: 'var(--text-secondary)' }}>Score: {assessment.risk_score.toFixed(1)} / 100</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: '4px' }}>
          <h4 style={{ margin: '0 0 0.5rem 0' }}>Fraud Probability</h4>
          <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{assessment.fraud_probability.toFixed(2)}%</div>
          <small style={{ color: 'var(--text-secondary)' }}>Supervised (XGBoost)</small>
        </div>
        <div style={{ padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: '4px' }}>
          <h4 style={{ margin: '0 0 0.5rem 0' }}>Anomaly Score</h4>
          <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{assessment.anomaly_score.toFixed(2)}</div>
          <small style={{ color: 'var(--text-secondary)' }}>Unsupervised (Isolation Forest)</small>
        </div>
      </div>

      <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Top Contributing Factors</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {assessment.contributing_factors.map((factor, idx) => (
          <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f0f0f0' }}>
            <span><Activity size={14} style={{ marginRight: '0.5rem', color: 'var(--text-secondary)'}} /> {factor.feature}</span>
            <span style={{ fontWeight: 500 }}>{factor.contribution.toFixed(2)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
