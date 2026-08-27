import React, { useState } from 'react';
import { analyzeBatch } from '../services/api';
import type { BatchRiskAssessment } from '../services/api';
import { UploadCloud, CheckCircle, AlertTriangle, ShieldAlert } from 'lucide-react';

export const BatchAnalysis: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BatchRiskAssessment | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        
        const transactions = [];
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          const values = lines[i].split(',');
          const tx: any = {};
          headers.forEach((header, index) => {
            if (header === 'Class') return; // Ignore labels if present
            tx[header] = parseFloat(values[index]) || 0;
          });
          transactions.push(tx);
        }

        const data = await analyzeBatch(transactions);
        setResult(data);
      } catch (err: any) {
        setError(err.message || 'Error processing CSV');
      } finally {
        setLoading(false);
      }
    };
    reader.onerror = () => {
      setError('Error reading file');
      setLoading(false);
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <div className="surface" style={{ marginBottom: '2rem', textAlign: 'center', padding: '3rem' }}>
        <UploadCloud size={48} style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }} />
        <h3 style={{ margin: '0 0 1rem 0' }}>Upload CSV for Batch Analysis</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem auto' }}>
          Upload a dataset containing multiple transactions to quickly identify high-risk anomalies and potential fraud.
        </p>
        <input 
          type="file" 
          accept=".csv" 
          onChange={handleFileUpload} 
          style={{ display: 'none' }} 
          id="csv-upload" 
        />
        <label htmlFor="csv-upload" className="btn" style={{ display: 'inline-block' }}>
          {loading ? 'Processing...' : 'Select CSV File'}
        </label>
        {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
      </div>

      {result && (
        <div className="surface">
          <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Batch Summary</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
             <div style={{ padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: '4px', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{result.total_transactions}</div>
                <small style={{ color: 'var(--text-secondary)' }}>Total Analyzed</small>
             </div>
             <div style={{ padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: '4px', textAlign: 'center' }}>
                <CheckCircle color="#388e3c" style={{ margin: '0 auto' }} />
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '0.5rem', color: '#388e3c' }}>{result.low_risk_count}</div>
                <small style={{ color: 'var(--text-secondary)' }}>Low Risk</small>
             </div>
             <div style={{ padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: '4px', textAlign: 'center' }}>
                <AlertTriangle color="#f57c00" style={{ margin: '0 auto' }} />
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '0.5rem', color: '#f57c00' }}>{result.medium_risk_count}</div>
                <small style={{ color: 'var(--text-secondary)' }}>Medium Risk</small>
             </div>
             <div style={{ padding: '1rem', backgroundColor: '#fff5f5', border: '1px solid #ffcdd2', borderRadius: '4px', textAlign: 'center' }}>
                <ShieldAlert color="#d32f2f" style={{ margin: '0 auto' }} />
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '0.5rem', color: '#d32f2f' }}>{result.high_risk_count}</div>
                <small style={{ color: 'var(--text-secondary)' }}>High Risk</small>
             </div>
          </div>
          
          {/* Display high risk subset */}
          <h4 style={{ marginBottom: '1rem' }}>High Risk Transactions (Top 5)</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                <th style={{ padding: '0.5rem' }}>ID (Row)</th>
                <th style={{ padding: '0.5rem' }}>Amount</th>
                <th style={{ padding: '0.5rem' }}>Score</th>
                <th style={{ padding: '0.5rem' }}>Primary Factor</th>
              </tr>
            </thead>
            <tbody>
              {result.results.filter(r => r.assessment.risk_level === 'HIGH').slice(0, 5).map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.5rem' }}>{idx + 1}</td>
                  <td style={{ padding: '0.5rem' }}>${row.transaction.Amount}</td>
                  <td style={{ padding: '0.5rem', color: '#d32f2f', fontWeight: 'bold' }}>{row.assessment.risk_score.toFixed(1)}</td>
                  <td style={{ padding: '0.5rem' }}>{row.assessment.contributing_factors[0]?.feature || 'N/A'}</td>
                </tr>
              ))}
              {result.high_risk_count === 0 && (
                <tr><td colSpan={4} style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No high risk transactions found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
