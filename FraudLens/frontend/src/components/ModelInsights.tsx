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

  if (loading) return <div className="glass-panel p-8 rounded-2xl flex justify-center items-center h-40"><span className="text-secondaryText animate-pulse">Loading AI Metrics...</span></div>;
  if (error) return <div className="glass-panel p-8 rounded-2xl border-red-500/30 text-red-400">Error: {error}</div>;

  const chartData = [
    { name: 'Precision', value: metrics.precision * 100 },
    { name: 'Recall', value: metrics.recall * 100 },
    { name: 'F1 Score', value: metrics.f1 * 100 },
    { name: 'ROC AUC', value: metrics.roc_auc * 100 },
    { name: 'PR AUC', value: metrics.pr_auc * 100 },
  ];

  return (
    <div className="glass-panel p-8 rounded-2xl mt-8">
      <div className="mb-8 border-b border-white/10 pb-4">
        <h2 className="text-2xl font-serif text-white mb-2 flex items-center gap-3">
          <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          XGBoost Supervised Model Validation
        </h2>
        <p className="text-secondaryText text-sm">
          Real-time performance metrics evaluated on the synthetic validation dataset.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="h-[320px] w-full bg-black/20 p-5 rounded-2xl border border-white/5 relative group hover:border-white/10 transition-colors">
          <h4 className="text-sm uppercase tracking-widest text-gray-400 font-semibold mb-6">Performance Metrics</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} dy={10} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} domain={[0, 100]} axisLine={false} tickLine={false} dx={-10} />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                formatter={(value: any) => [`${Number(value).toFixed(1)}%`, 'Score']}
                contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', backdropFilter: 'blur(8px)', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <cell key={`cell-${index}`} fill={index === 3 ? '#3b82f6' : '#475569'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="h-[320px] w-full bg-black/20 p-5 rounded-2xl border border-white/5 relative group hover:border-white/10 transition-colors">
          <h4 className="text-sm uppercase tracking-widest text-gray-400 font-semibold mb-6 flex items-center gap-2">
            ROC Curve <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/20 animate-pulse">LIVE</span>
          </h4>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metrics.roc_curve || []} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                dataKey="fpr" 
                type="number" 
                domain={[0, 1]} 
                tick={{ fontSize: 11, fill: '#94a3b8' }} 
                axisLine={false}
                tickLine={false}
                dy={10}
                label={{ value: 'False Positive Rate', position: 'insideBottom', offset: -15, fill: '#64748b', fontSize: 11 }} 
              />
              <YAxis 
                type="number" 
                domain={[0, 1]} 
                tick={{ fontSize: 11, fill: '#94a3b8' }} 
                axisLine={false}
                tickLine={false}
                dx={-10}
                label={{ value: 'True Positive Rate', angle: -90, position: 'insideLeft', offset: 10, fill: '#64748b', fontSize: 11 }} 
              />
              <Tooltip 
                formatter={(value: any, name: any) => [Number(value).toFixed(3), name === 'tpr' ? 'TPR' : 'FPR']}
                labelFormatter={(label) => `FPR: ${Number(label).toFixed(3)}`}
                contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', backdropFilter: 'blur(8px)', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
              />
              <ReferenceLine segment={[{ x: 0, y: 0 }, { x: 1, y: 1 }]} stroke="rgba(255,255,255,0.2)" strokeDasharray="3 3" />
              <Line 
                type="monotone" 
                dataKey="tpr" 
                stroke="#3b82f6" 
                strokeWidth={3} 
                dot={false} 
                activeDot={{ r: 6, fill: '#60a5fa', stroke: '#fff', strokeWidth: 2 }} 
                isAnimationActive={true} 
                animationDuration={1500}
                animationEasing="ease-out"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-colors">
            <h4 className="text-white font-medium mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
              Model Architecture
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex justify-between items-center"><strong className="text-gray-300">Supervised Component:</strong> <span>XGBoost Classifier</span></li>
                <li className="flex justify-between items-center"><strong className="text-gray-300">Unsupervised Component:</strong> <span>Isolation Forest</span></li>
                <li className="flex justify-between items-center"><strong className="text-gray-300">Hybrid Strategy:</strong> <span>70% Supervised / 30% Anomaly</span></li>
            </ul>
        </div>
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-colors">
            <h4 className="text-white font-medium mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
              Decision Thresholds
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex justify-between items-center"><strong className="text-emerald-400">Low Risk:</strong> <span className="bg-emerald-500/20 px-2 py-0.5 rounded">0 - 34</span></li>
                <li className="flex justify-between items-center"><strong className="text-yellow-400">Medium Risk:</strong> <span className="bg-yellow-500/20 px-2 py-0.5 rounded">35 - 64</span></li>
                <li className="flex justify-between items-center"><strong className="text-red-400">High Risk:</strong> <span className="bg-red-500/20 px-2 py-0.5 rounded">65 - 100</span></li>
            </ul>
        </div>
      </div>
    </div>
  );
};
