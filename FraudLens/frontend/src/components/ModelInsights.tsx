import React, { useEffect, useState } from 'react';
import { getMetrics } from '../services/api';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';

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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        <div style={{ height: '300px', width: '100%' }}>
          <h4 style={{ margin: '0 0 1rem 0' }}>Performance Metrics</h4>
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

        <div style={{ height: '300px', width: '100%' }}>
          <h4 style={{ margin: '0 0 1rem 0' }}>ROC Curve (Live)</h4>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metrics.roc_curve || []} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaeaea" />
              <XAxis 
                dataKey="fpr" 
                type="number" 
                domain={[0, 1]} 
                tick={{ fontSize: 12, fill: '#66625D' }} 
                label={{ value: 'False Positive Rate', position: 'bottom', fill: '#66625D', fontSize: 12 }} 
              />
              <YAxis 
                type="number" 
                domain={[0, 1]} 
                tick={{ fontSize: 12, fill: '#66625D' }} 
                label={{ value: 'True Positive Rate', angle: -90, position: 'left', fill: '#66625D', fontSize: 12 }} 
              />
              <Tooltip 
                formatter={(value: any, name: string) => [Number(value).toFixed(3), name === 'tpr' ? 'TPR' : 'FPR']}
                labelFormatter={(label) => `FPR: ${Number(label).toFixed(3)}`}
                contentStyle={{ backgroundColor: '#1C1C1C', color: '#fff', border: 'none', borderRadius: '4px' }}
              />
              <ReferenceLine segment={[{ x: 0, y: 0 }, { x: 1, y: 1 }]} stroke="#666" strokeDasharray="3 3" />
              <Line type="monotone" dataKey="tpr" stroke="#00A3FF" strokeWidth={2} dot={false} activeDot={{ r: 4 }} isAnimationActive={true} />
            </LineChart>
          </ResponsiveContainer>
        </div>
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
