import React, { useEffect, useState } from 'react';
import { getMetrics } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const ModelInsights: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await getMetrics();
        setMetrics(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) return <div className="surface">Loading metrics...</div>;
  if (error) return <div className="surface" style={{ color: 'red' }}>Error: {error}</div>;

  const chartData = [
    { name: 'Precision', value: metrics.precision * 100 },
    { name: 'Recall', value: metrics.recall * 100 },
    { name: 'F1 Score', value: metrics.f1 * 100 },
    { name: 'ROC AUC', value: metrics.roc_auc * 100 },
    { name: 'PR AUC', value: metrics.pr_auc * 100 },
  ];

  return (
    <div className="surface">
      <h2 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
        XGBoost Supervised Model Metrics
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        These metrics evaluate the performance of the supervised classification model on the synthetic validation dataset.
      </p>

      <div style={{ height: '300px', width: '100%', marginBottom: '2rem' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#66625D' }} />
            <YAxis tick={{ fontSize: 12, fill: '#66625D' }} domain={[0, 100]} />
            <Tooltip 
              formatter={(value: any) => [`${Number(value).toFixed(1)}%`, 'Score']}
              contentStyle={{ backgroundColor: '#1C1C1C', color: '#fff', border: 'none', borderRadius: '4px' }}
            />
            <Bar dataKey="value" fill="#161616" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ backgroundColor: 'var(--bg-color)', padding: '1rem', borderRadius: '4px' }}>
            <h4 style={{ margin: '0 0 0.5rem 0' }}>Architecture</h4>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', color: 'var(--text-secondary)' }}>
                <li><strong>Supervised:</strong> XGBoost Classifier</li>
                <li><strong>Unsupervised:</strong> Isolation Forest</li>
                <li><strong>Hybrid Strategy:</strong> 70% Supervised / 30% Anomaly</li>
            </ul>
        </div>
        <div style={{ backgroundColor: 'var(--bg-color)', padding: '1rem', borderRadius: '4px' }}>
            <h4 style={{ margin: '0 0 0.5rem 0' }}>Thresholds</h4>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', color: 'var(--text-secondary)' }}>
                <li><strong>Low Risk:</strong> 0 - 34</li>
                <li><strong>Medium Risk:</strong> 35 - 64</li>
                <li><strong>High Risk:</strong> 65 - 100</li>
            </ul>
        </div>
      </div>
    </div>
  );
};
