import React, { useState } from 'react';
import { predictSingle, predictBatch } from './api/client';
import type { RiskAssessment, BatchRiskAssessment } from './api/client';
import RiskScore from './components/RiskScore';

const DUMMY_FEATURE_NAMES: Record<string, string> = {
  V1: "Merchant Category Score",
  V2: "Distance from Home",
  V3: "Distance from Last Tx",
  V4: "Ratio to Median Price",
  V5: "Repeat Retailer Flag",
  V6: "Used Chip/PIN",
  V7: "Online Order Flag",
  V8: "Location IP Risk",
  V9: "Account Age Days",
  V10: "Recent Login Fails",
  V11: "Tx Count 24h",
  V12: "Device Risk Score",
  V13: "Velocity of Spend",
  V14: "Cross-border Tx Flag",
  V15: "VPN Usage Detected",
  V16: "Time Since Password Change",
  V17: "New Device Flag",
  V18: "Card Present Flag",
  V19: "Amount vs Balance",
  V20: "Past Fraud Alerts",
  V21: "Billing Address Match",
  V22: "Shipping Address Match",
  V23: "Same IP Tx Count",
  V24: "Is Weekend",
  V25: "Is Holiday",
  V26: "Multiple Cards Same Device",
  V27: "High Risk Country Flag",
  V28: "Unusual Merchant Time"
};

function App() {
  const [activeTab, setActiveTab] = useState<'single' | 'batch'>('single');

  // Single transaction state
  const [txData, setTxData] = useState<any>({
    Time: 0, Amount: 100, V1: 0, V2: 0, V3: 0, V4: 0, V5: 0, V6: 0, V7: 0, V8: 0, V9: 0,
    V10: 0, V11: 0, V12: 0, V13: 0, V14: 0, V15: 0, V16: 0, V17: 0, V18: 0, V19: 0,
    V20: 0, V21: 0, V22: 0, V23: 0, V24: 0, V25: 0, V26: 0, V27: 0, V28: 0
  });
  const [singleResult, setSingleResult] = useState<RiskAssessment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Batch state
  const [file, setFile] = useState<File | null>(null);
  const [batchResult, setBatchResult] = useState<BatchRiskAssessment | null>(null);
  const [filterLevel, setFilterLevel] = useState<string>('All');

  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await predictSingle(txData);
      setSingleResult(res.data);
    } catch (err: any) {
      setError(err.message || 'Error occurred');
    }
    setLoading(false);
  };

  const handleBatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const res = await predictBatch(file);
      setBatchResult(res.data);
    } catch (err: any) {
      setError(err.message || 'Error occurred');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-darkSurface text-white p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-serif">FraudLens</h1>
          <nav className="flex gap-4">
            <button onClick={() => setActiveTab('single')} className={`px-4 py-2 rounded ${activeTab === 'single' ? 'bg-white text-black' : 'hover:bg-gray-800'}`}>Analyze Transaction</button>
            <button onClick={() => setActiveTab('batch')} className={`px-4 py-2 rounded ${activeTab === 'batch' ? 'bg-white text-black' : 'hover:bg-gray-800'}`}>Batch Analysis</button>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 mt-8">
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
        
        {activeTab === 'single' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-surface p-6 rounded-lg border border-border shadow-sm">
              <h2 className="text-2xl mb-4 font-serif">Transaction Details</h2>
              <form onSubmit={handleSingleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-sm text-secondaryText mb-1">Amount</label>
                    <input type="number" value={txData.Amount} onChange={e => setTxData({...txData, Amount: parseFloat(e.target.value)})} className="border border-border rounded p-2" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm text-secondaryText mb-1">Time</label>
                    <input type="number" value={txData.Time} onChange={e => setTxData({...txData, Time: parseFloat(e.target.value)})} className="border border-border rounded p-2" />
                  </div>
                  {Array.from({length: 28}, (_, i) => i + 1).map(i => (
                    <div key={`V${i}`} className="flex flex-col">
                      <label className="text-sm text-secondaryText mb-1">{DUMMY_FEATURE_NAMES[`V${i}`]}</label>
                      <input type="number" step="0.1" value={txData[`V${i}`]} onChange={e => setTxData({...txData, [`V${i}`]: parseFloat(e.target.value)})} className="border border-border rounded p-2" />
                    </div>
                  ))}
                </div>
                <button type="submit" disabled={loading} className="w-full bg-darkSurface text-white py-3 rounded mt-4 hover:bg-gray-800 disabled:opacity-50">
                  {loading ? 'Analyzing...' : 'Analyze Risk'}
                </button>
              </form>
            </div>

            <div>
              {singleResult ? (
                <div className="space-y-6">
                  <RiskScore score={singleResult.risk_score} level={singleResult.risk_level} />
                  
                  <div className="bg-surface p-6 rounded-lg border border-border">
                    <h3 className="text-xl mb-4 font-serif">Model Insights</h3>
                    <div className="flex justify-between mb-2">
                      <span className="text-secondaryText">Fraud Probability</span>
                      <span className="font-medium">{(singleResult.fraud_probability * 100).toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between mb-4">
                      <span className="text-secondaryText">Anomaly Score</span>
                      <span className="font-medium">{(singleResult.anomaly_score * 100).toFixed(2)}%</span>
                    </div>
                    
                    <h4 className="font-medium mt-6 mb-2 text-red-800">Factors Increasing Risk</h4>
                    <ul className="space-y-2 mb-4">
                      {singleResult.contributing_factors.filter(f => f.direction.includes('Increase')).map(f => (
                        <li key={f.feature} className="flex justify-between items-center p-2 bg-red-50 rounded border border-red-100">
                          <span>{DUMMY_FEATURE_NAMES[f.feature] || f.feature}</span>
                          <span className="text-red-700 font-medium text-sm">
                            +{f.contribution.toFixed(4)}
                          </span>
                        </li>
                      ))}
                      {singleResult.contributing_factors.filter(f => f.direction.includes('Increase')).length === 0 && (
                        <li className="text-sm text-secondaryText italic p-2">None</li>
                      )}
                    </ul>

                    <h4 className="font-medium mt-4 mb-2 text-green-800">Factors Decreasing Risk</h4>
                    <ul className="space-y-2">
                      {singleResult.contributing_factors.filter(f => f.direction.includes('Decrease')).map(f => (
                        <li key={f.feature} className="flex justify-between items-center p-2 bg-green-50 rounded border border-green-100">
                          <span>{DUMMY_FEATURE_NAMES[f.feature] || f.feature}</span>
                          <span className="text-green-700 font-medium text-sm">
                            {f.contribution.toFixed(4)}
                          </span>
                        </li>
                      ))}
                      {singleResult.contributing_factors.filter(f => f.direction.includes('Decrease')).length === 0 && (
                        <li className="text-sm text-secondaryText italic p-2">None</li>
                      )}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center border-2 border-dashed border-border rounded-lg text-secondaryText p-12 text-center">
                  Submit a transaction to see the risk assessment and model explainability.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'batch' && (
          <div className="space-y-8">
            <div className="bg-surface p-8 rounded-lg border border-border text-center">
              <h2 className="text-2xl mb-4 font-serif">Upload CSV</h2>
              <form onSubmit={handleBatchSubmit} className="flex flex-col items-center gap-4">
                <input type="file" accept=".csv" onChange={e => setFile(e.target.files?.[0] || null)} className="border p-2 rounded w-full max-w-md" />
                <button type="submit" disabled={loading || !file} className="bg-darkSurface text-white px-8 py-3 rounded hover:bg-gray-800 disabled:opacity-50">
                  {loading ? 'Processing...' : 'Run Batch Analysis'}
                </button>
              </form>
            </div>

            {batchResult && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-surface p-6 rounded-lg border border-border">
                    <h3 className="text-secondaryText mb-2">Total</h3>
                    <p className="text-3xl">{batchResult.total_transactions}</p>
                  </div>
                  <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
                    <h3 className="text-red-800 mb-2">High Risk</h3>
                    <p className="text-3xl text-red-900">{batchResult.high_risk_count}</p>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
                    <h3 className="text-yellow-800 mb-2">Medium Risk</h3>
                    <p className="text-3xl text-yellow-900">{batchResult.medium_risk_count}</p>
                  </div>
                  <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
                    <h3 className="text-green-800 mb-2">Low Risk</h3>
                    <p className="text-3xl text-green-900">{batchResult.low_risk_count}</p>
                  </div>
                </div>

                <div className="bg-surface rounded-lg border border-border overflow-hidden">
                  <div className="p-4 border-b border-border flex items-center justify-between bg-gray-50">
                    <h3 className="font-medium">Transaction Results</h3>
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-secondaryText">Filter:</label>
                      <select 
                        value={filterLevel} 
                        onChange={e => setFilterLevel(e.target.value)}
                        className="border border-border rounded p-1 text-sm bg-white"
                      >
                        <option value="All">All Transactions</option>
                        <option value="High">High Risk Only</option>
                        <option value="Medium">Medium Risk Only</option>
                        <option value="Low">Low Risk Only</option>
                      </select>
                    </div>
                  </div>
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-secondaryText">
                      <tr>
                        <th className="p-4">Row Index</th>
                        <th className="p-4">Risk Score</th>
                        <th className="p-4">Risk Level</th>
                        <th className="p-4">Fraud Prob</th>
                        <th className="p-4">Anomaly Score</th>
                      </tr>
                    </thead >
                    <tbody>
                      {batchResult.results
                        .filter(r => filterLevel === 'All' || r.risk_level === filterLevel)
                        .slice(0, 100)
                        .map((r, idx) => (
                        <tr key={idx} className="border-t border-border">
                          <td className="p-4">{r.index}</td>
                          <td className="p-4">{r.risk_score.toFixed(1)}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded text-sm ${r.risk_level === 'High' ? 'bg-red-100 text-red-800' : r.risk_level === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                              {r.risk_level}
                            </span>
                          </td>
                          <td className="p-4">{(r.fraud_probability * 100).toFixed(1)}%</td>
                          <td className="p-4">{(r.anomaly_score * 100).toFixed(1)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {batchResult.results.filter(r => filterLevel === 'All' || r.risk_level === filterLevel).length > 100 && (
                    <div className="p-4 text-center text-secondaryText bg-gray-50 border-t border-border">
                      Showing first 100 {filterLevel !== 'All' ? filterLevel.toLowerCase() + ' risk' : ''} results.
                    </div>
                  )}
                  {batchResult.results.filter(r => filterLevel === 'All' || r.risk_level === filterLevel).length === 0 && (
                    <div className="p-8 text-center text-secondaryText bg-white border-t border-border">
                      No transactions match the selected filter.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
