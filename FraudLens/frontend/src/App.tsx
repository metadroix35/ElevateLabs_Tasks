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
    <div className="min-h-screen text-primaryText">
      <header className="glass-panel sticky top-0 z-50 p-6 border-b-0 border-t-0 border-x-0 rounded-none mb-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-serif font-semibold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">FraudLens</h1>
          </div>
          <nav className="flex gap-2 bg-black/20 p-1 rounded-lg border border-white/5">
            <button onClick={() => setActiveTab('single')} className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'single' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>Analyze Transaction</button>
            <button onClick={() => setActiveTab('batch')} className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'batch' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>Batch Analysis</button>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 pt-0">
        {error && (
          <div className="glass-panel border-red-500/30 text-red-200 px-6 py-4 rounded-xl mb-8 flex items-center gap-3">
            <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {error}
          </div>
        )}
        
        {activeTab === 'single' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 glass-panel p-8 rounded-2xl">
              <div className="mb-6">
                <h2 className="text-2xl font-serif text-white mb-2">Transaction Details</h2>
                <p className="text-secondaryText text-sm">Enter transaction features to calculate risk score instantly.</p>
              </div>
              <form onSubmit={handleSingleSubmit} className="space-y-5 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                <div className="grid grid-cols-2 gap-5">
                  <div className="flex flex-col">
                    <label className="text-xs text-secondaryText mb-1.5 uppercase tracking-wider font-semibold">Amount</label>
                    <input type="number" value={txData.Amount} onChange={e => setTxData({...txData, Amount: parseFloat(e.target.value)})} className="glass-input rounded-lg p-2.5 text-sm" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs text-secondaryText mb-1.5 uppercase tracking-wider font-semibold">Time</label>
                    <input type="number" value={txData.Time} onChange={e => setTxData({...txData, Time: parseFloat(e.target.value)})} className="glass-input rounded-lg p-2.5 text-sm" />
                  </div>
                  {Array.from({length: 28}, (_, i) => i + 1).map(i => (
                    <div key={`V${i}`} className="flex flex-col">
                      <label className="text-xs text-secondaryText mb-1.5 uppercase tracking-wider font-semibold truncate" title={DUMMY_FEATURE_NAMES[`V${i}`]}>{DUMMY_FEATURE_NAMES[`V${i}`]}</label>
                      <input type="number" step="0.1" value={txData[`V${i}`]} onChange={e => setTxData({...txData, [`V${i}`]: parseFloat(e.target.value)})} className="glass-input rounded-lg p-2.5 text-sm" />
                    </div>
                  ))}
                </div>
                <div className="pt-4 sticky bottom-0 bg-gradient-to-t from-[#162137] via-[#162137] to-transparent pb-1">
                  <button type="submit" disabled={loading} className="w-full btn-primary py-3.5 rounded-xl font-medium text-sm disabled:opacity-50 flex items-center justify-center gap-2">
                    {loading ? (
                      <><svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg> Analyzing...</>
                    ) : 'Analyze Risk'}
                  </button>
                </div>
              </form>
            </div>

            <div className="lg:col-span-7 space-y-6">
              {singleResult ? (
                <>
                  <div className="glass-panel p-6 rounded-2xl border-t-4" style={{borderTopColor: singleResult.risk_level === 'HIGH' ? '#ef4444' : singleResult.risk_level === 'MEDIUM' ? '#eab308' : '#22c55e'}}>
                    <RiskScore score={singleResult.risk_score} level={singleResult.risk_level} />
                  </div>
                  
                  <div className="glass-panel p-8 rounded-2xl">
                    <h3 className="text-xl mb-6 font-serif text-white">Model Insights</h3>
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                        <div className="text-secondaryText text-sm mb-1">Fraud Probability</div>
                        <div className="text-2xl font-semibold text-white">{(singleResult.fraud_probability).toFixed(2)}%</div>
                      </div>
                      <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                        <div className="text-secondaryText text-sm mb-1">Anomaly Score</div>
                        <div className="text-2xl font-semibold text-white">{(singleResult.anomaly_score).toFixed(2)}%</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-sm uppercase tracking-wider text-red-400 mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                          Risk Increasers
                        </h4>
                        <ul className="space-y-2">
                          {singleResult.contributing_factors.filter(f => f.direction.toUpperCase().includes('INCREASE')).map(f => (
                            <li key={f.feature} className="flex justify-between items-center p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                              <span className="text-sm text-gray-300">{DUMMY_FEATURE_NAMES[f.feature] || f.feature}</span>
                              <span className="text-red-400 font-semibold text-sm">+{f.contribution.toFixed(2)}</span>
                            </li>
                          ))}
                          {singleResult.contributing_factors.filter(f => f.direction.toUpperCase().includes('INCREASE')).length === 0 && (
                            <li className="text-sm text-secondaryText italic p-3 bg-white/5 rounded-lg">None detected</li>
                          )}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium text-sm uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
                          Risk Mitigators
                        </h4>
                        <ul className="space-y-2">
                          {singleResult.contributing_factors.filter(f => f.direction.toUpperCase().includes('DECREASE')).map(f => (
                            <li key={f.feature} className="flex justify-between items-center p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                              <span className="text-sm text-gray-300">{DUMMY_FEATURE_NAMES[f.feature] || f.feature}</span>
                              <span className="text-emerald-400 font-semibold text-sm">-{f.contribution.toFixed(2)}</span>
                            </li>
                          ))}
                          {singleResult.contributing_factors.filter(f => f.direction.toUpperCase().includes('DECREASE')).length === 0 && (
                            <li className="text-sm text-secondaryText italic p-3 bg-white/5 rounded-lg">None detected</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center glass-panel border-dashed border-white/20 rounded-2xl text-secondaryText p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-lg text-white font-medium mb-2">No Transaction Selected</h3>
                  <p className="max-w-xs text-sm">Submit a transaction from the panel on the left to see the AI-driven risk assessment and explainability metrics.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'batch' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="glass-panel p-10 rounded-2xl text-center max-w-3xl mx-auto">
              <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-6 text-blue-400">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
              </div>
              <h2 className="text-2xl font-serif text-white mb-3">Upload Transaction Batch</h2>
              <p className="text-secondaryText text-sm mb-8">Upload a CSV file containing transaction data for bulk AI analysis.</p>
              
              <form onSubmit={handleBatchSubmit} className="flex flex-col items-center gap-5">
                <div className="relative w-full max-w-md group">
                  <input type="file" accept=".csv" onChange={e => setFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <div className={`glass-input border-dashed border-2 rounded-xl p-4 flex items-center justify-center gap-3 transition-colors ${file ? 'border-blue-500/50 bg-blue-500/10' : 'group-hover:border-white/30'}`}>
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    <span className="text-sm text-gray-300 font-medium">{file ? file.name : 'Choose a CSV file or drag it here'}</span>
                  </div>
                </div>
                <button type="submit" disabled={loading || !file} className="btn-primary px-8 py-3.5 rounded-xl font-medium disabled:opacity-50 flex items-center gap-2">
                  {loading ? 'Processing Batch...' : 'Run Batch Analysis'}
                </button>
              </form>
            </div>

            {batchResult && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="glass-panel p-6 rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 text-white"><svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg></div>
                    <h3 className="text-secondaryText text-sm uppercase tracking-wider font-semibold mb-2">Total</h3>
                    <p className="text-3xl font-bold text-white">{batchResult.total_transactions}</p>
                  </div>
                  <div className="glass-panel p-6 rounded-xl border-t-4 border-red-500 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 text-red-500"><svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg></div>
                    <h3 className="text-red-400 text-sm uppercase tracking-wider font-semibold mb-2">High Risk</h3>
                    <p className="text-3xl font-bold text-white">{batchResult.high_risk_count}</p>
                  </div>
                  <div className="glass-panel p-6 rounded-xl border-t-4 border-yellow-500 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 text-yellow-500"><svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg></div>
                    <h3 className="text-yellow-400 text-sm uppercase tracking-wider font-semibold mb-2">Medium Risk</h3>
                    <p className="text-3xl font-bold text-white">{batchResult.medium_risk_count}</p>
                  </div>
                  <div className="glass-panel p-6 rounded-xl border-t-4 border-emerald-500 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 text-emerald-500"><svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg></div>
                    <h3 className="text-emerald-400 text-sm uppercase tracking-wider font-semibold mb-2">Low Risk</h3>
                    <p className="text-3xl font-bold text-white">{batchResult.low_risk_count}</p>
                  </div>
                </div>

                <div className="glass-panel rounded-2xl overflow-hidden">
                  <div className="p-5 border-b border-white/5 flex items-center justify-between bg-black/20">
                    <h3 className="font-serif font-medium text-lg text-white">Transaction Results</h3>
                    <div className="flex items-center gap-3">
                      <label className="text-sm text-secondaryText font-medium">Filter:</label>
                      <select 
                        value={filterLevel} 
                        onChange={e => setFilterLevel(e.target.value)}
                        className="glass-input rounded-lg px-3 py-1.5 text-sm cursor-pointer"
                      >
                        <option value="All">All Transactions</option>
                        <option value="HIGH">High Risk Only</option>
                        <option value="MEDIUM">Medium Risk Only</option>
                        <option value="LOW">Low Risk Only</option>
                      </select>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-white/5 text-secondaryText text-xs uppercase tracking-wider font-semibold">
                        <tr>
                          <th className="p-4 pl-6">Row Index</th>
                          <th className="p-4">Risk Score</th>
                          <th className="p-4">Risk Level</th>
                          <th className="p-4">Fraud Prob</th>
                          <th className="p-4">Anomaly Score</th>
                        </tr>
                      </thead >
                      <tbody className="divide-y divide-white/5">
                        {batchResult.results
                          .filter(r => filterLevel === 'All' || r.assessment?.risk_level === filterLevel)
                          .slice(0, 100)
                          .map((r, idx) => (
                          <tr key={idx} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 pl-6 font-mono text-sm text-gray-400">{idx + 1}</td>
                            <td className="p-4 font-semibold text-white">{r.assessment?.risk_score?.toFixed(1)}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${r.assessment?.risk_level === 'HIGH' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : r.assessment?.risk_level === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                                {r.assessment?.risk_level}
                              </span>
                            </td>
                            <td className="p-4 text-sm text-gray-300">{(r.assessment?.fraud_probability).toFixed(1)}%</td>
                            <td className="p-4 text-sm text-gray-300">{(r.assessment?.anomaly_score).toFixed(1)}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {batchResult.results.filter(r => filterLevel === 'All' || r.assessment?.risk_level === filterLevel).length > 100 && (
                    <div className="p-4 text-center text-sm text-secondaryText bg-black/20 border-t border-white/5">
                      Showing first 100 {filterLevel !== 'All' ? filterLevel.toLowerCase() + ' risk' : ''} results.
                    </div>
                  )}
                  {batchResult.results.filter(r => filterLevel === 'All' || r.assessment?.risk_level === filterLevel).length === 0 && (
                    <div className="p-12 text-center text-secondaryText border-t border-white/5 flex flex-col items-center">
                      <svg className="w-12 h-12 mb-3 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
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
