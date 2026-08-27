import React, { useState } from 'react';
import { analyzeTransaction } from '../services/api';
import type { RiskAssessment } from '../services/api';
import { RiskResult } from './RiskResult';

export const AnalyzeTransaction: React.FC = () => {
  const [formData, setFormData] = useState<any>({
    Time: 50000,
    Amount: 150,
  });
  
  const [assessment, setAssessment] = useState<RiskAssessment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize V1-V28 with 0
  if (Object.keys(formData).length === 2) {
    const initial: any = { ...formData };
    for (let i = 1; i <= 28; i++) {
      initial[`V${i}`] = 0;
    }
    setFormData(initial);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: parseFloat(e.target.value) || 0
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeTransaction(formData);
      setAssessment(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
      <div className="surface">
        <h2 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Transaction Input</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Time</label>
              <input type="number" name="Time" value={formData.Time || 0} onChange={handleChange} className="input" step="any" required />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Amount</label>
              <input type="number" name="Amount" value={formData.Amount || 0} onChange={handleChange} className="input" step="any" required />
            </div>
          </div>

          <details style={{ marginBottom: '1.5rem' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 500, padding: '0.5rem', backgroundColor: 'var(--bg-color)', borderRadius: '4px' }}>
              Advanced PCA Features (V1 - V28)
            </summary>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginTop: '1rem' }}>
              {Array.from({ length: 28 }, (_, i) => i + 1).map(i => (
                <div key={`V${i}`}>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>V{i}</label>
                  <input type="number" name={`V${i}`} value={formData[`V${i}`] || 0} onChange={handleChange} className="input" style={{ padding: '0.25rem' }} step="any" />
                </div>
              ))}
            </div>
          </details>

          <button type="submit" className="btn" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Analyzing...' : 'Analyze Transaction'}
          </button>
        </form>
      </div>

      <div>
        <RiskResult assessment={assessment} loading={loading} error={error} />
      </div>
    </div>
  );
};
