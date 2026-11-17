import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Trash2,
  Printer,
  ChevronDown,
  ChevronUp,
  FileCheck,
  X,
  Droplet
} from 'lucide-react';
import apiClient from '../services/api';

export const History = () => {
  const [auditRecords, setAuditRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedRecordId, setExpandedRecordId] = useState(null);
  const [selectedRecordForCertificate, setSelectedRecordForCertificate] = useState(null);

  // Search and Filter Criteria State
  const [searchLocationQuery, setSearchLocationQuery] = useState('');
  const [filterRiskCategory, setFilterRiskCategory] = useState('');

  const fetchAuditRecords = async () => {
    try {
      setIsLoading(true);
      const queryParameters = new URLSearchParams();
      if (searchLocationQuery) queryParameters.append('location', searchLocationQuery);
      if (filterRiskCategory) queryParameters.append('riskStatus', filterRiskCategory);

      const response = await apiClient.get(`/history?${queryParameters.toString()}`);
      if (response.data?.success) {
        setAuditRecords(response.data.data);
      }
    } catch (fetchError) {
      console.error('Error fetching audit history:', fetchError.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditRecords();
  }, [searchLocationQuery, filterRiskCategory]);

  const handleDeleteRecord = async (recordId) => {
    const isConfirmed = window.confirm('Are you sure you want to permanently delete this certified water record?');
    if (!isConfirmed) return;

    try {
      await apiClient.delete(`/history/${recordId}`);
      setAuditRecords((previousList) => previousList.filter((record) => record._id !== recordId));
    } catch (deleteError) {
      const errorMessage = deleteError.response?.data?.error || 'Failed to delete record.';
      alert(errorMessage);
    }
  };

  const toggleRowExpansion = (recordId) => {
    setExpandedRecordId((currentExpandedId) =>
      currentExpandedId === recordId ? null : recordId
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Audit Logs & Lab Reports</h1>
          <p className="text-sm text-slate-500 mt-0.5">Historical verification ledger and exportable regulatory certificates</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchLocationQuery}
            onChange={(event) => setSearchLocationQuery(event.target.value)}
            placeholder="Search by Sampling Site or Station name..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-sky-500 font-medium"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={filterRiskCategory}
            onChange={(event) => setFilterRiskCategory(event.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="">All Risk Classifications</option>
            <option value="Safe">Safe (≥75%)</option>
            <option value="Moderate">Moderate (40–74%)</option>
            <option value="Critical">Critical (&lt;40%)</option>
          </select>
        </div>
      </div>

      {/* Audit Records Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading audit records...</div>
        ) : auditRecords.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">No matching water telemetry records found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Station / Location</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Drinkability Score</th>
                  <th className="py-3 px-4">Risk Status</th>
                  <th className="py-3 px-4">pH</th>
                  <th className="py-3 px-4">Turbidity</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditRecords.map((record) => {
                  const isExpanded = expandedRecordId === record._id;
                  return (
                    <React.Fragment key={record._id}>
                      <tr
                        className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                        onClick={() => toggleRowExpansion(record._id)}
                      >
                        <td className="py-3 px-4 font-bold text-slate-900">{record.location}</td>
                        <td className="py-3 px-4 text-slate-500">
                          {new Date(record.timestamp).toLocaleString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">
                          {record.drinkabilityScore.toFixed(2)}%
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              record.riskStatus === 'Safe'
                                ? 'bg-emerald-100 text-emerald-800'
                                : record.riskStatus === 'Moderate'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {record.riskStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono">{record.ph?.toFixed(2)}</td>
                        <td className="py-3 px-4 font-mono">{record.turbidity?.toFixed(2)} NTU</td>
                        <td className="py-3 px-4 text-right" onClick={(event) => event.stopPropagation()}>
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => setSelectedRecordForCertificate(record)}
                              title="Export Lab Certificate"
                              className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-md transition-colors"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteRecord(record._id)}
                              title="Delete Record"
                              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => toggleRowExpansion(record._id)}
                              className="p-1.5 text-slate-400 hover:text-slate-700"
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expandable Parameter Details */}
                      {isExpanded && (
                        <tr className="bg-slate-50/50">
                          <td colSpan={7} className="p-4 border-t border-slate-100">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-3 bg-white rounded-lg border border-slate-200">
                              <div>
                                <span className="text-[10px] uppercase font-bold text-slate-400">Temperature</span>
                                <p className="font-mono text-xs font-semibold">{record.temperature}°C</p>
                              </div>
                              <div>
                                <span className="text-[10px] uppercase font-bold text-slate-400">Dissolved Oxygen</span>
                                <p className="font-mono text-xs font-semibold">{record.do} mg/L</p>
                              </div>
                              <div>
                                <span className="text-[10px] uppercase font-bold text-slate-400">Biochemical Demand (BOD)</span>
                                <p className="font-mono text-xs font-semibold">{record.bod} mg/L</p>
                              </div>
                              <div>
                                <span className="text-[10px] uppercase font-bold text-slate-400">Lead Concentration</span>
                                <p className="font-mono text-xs font-semibold">{record.lead} mg/L</p>
                              </div>
                              <div>
                                <span className="text-[10px] uppercase font-bold text-slate-400">Mercury Concentration</span>
                                <p className="font-mono text-xs font-semibold">{record.mercury} mg/L</p>
                              </div>
                              <div>
                                <span className="text-[10px] uppercase font-bold text-slate-400">Arsenic Concentration</span>
                                <p className="font-mono text-xs font-semibold">{record.arsenic} mg/L</p>
                              </div>
                              <div>
                                <span className="text-[10px] uppercase font-bold text-slate-400">Predicted Class</span>
                                <p className="font-mono text-xs font-semibold">Class {record.predictedClass}</p>
                              </div>
                              <div>
                                <span className="text-[10px] uppercase font-bold text-slate-400">Submitted By</span>
                                <p className="font-mono text-xs font-semibold">{record.submittedBy?.name || 'Lab Analyst'}</p>
                              </div>
                            </div>

                            {/* Warnings and Treatment Recommendations */}
                            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="p-2.5 bg-rose-50/50 rounded border border-rose-100 text-[11px] text-rose-800">
                                <span className="font-bold block mb-1">Warnings:</span>
                                {record.warnings?.join(' | ') || 'None'}
                              </div>
                              <div className="p-2.5 bg-sky-50/50 rounded border border-sky-100 text-[11px] text-sky-800">
                                <span className="font-bold block mb-1">Recommended Treatment:</span>
                                {record.recommendations?.join(' | ') || 'Standard Monitoring'}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Lab Certificate Print Modal */}
      {selectedRecordForCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden print-card">
            {/* Modal Top Bar */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between no-print">
              <div className="flex items-center space-x-2">
                <FileCheck className="w-5 h-5 text-sky-400" />
                <h3 className="font-bold text-sm tracking-tight">Certified Water Quality Report</h3>
              </div>
              <button
                onClick={() => setSelectedRecordForCertificate(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Certificate Body */}
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-start border-b border-slate-200 pb-5">
                <div>
                  <div className="flex items-center space-x-2">
                    <Droplet className="w-5 h-5 text-sky-600" />
                    <span className="font-black text-xl text-slate-900 tracking-tight">AquaSense AI</span>
                  </div>
                  <p className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold mt-0.5">
                    Laboratory Telemetry Certificate
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-mono block">Certificate ID</span>
                  <span className="text-xs font-mono font-bold text-slate-800">{selectedRecordForCertificate._id}</span>
                </div>
              </div>

              {/* Certificate Summary */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Site Location</span>
                  <p className="text-sm font-bold text-slate-900">{selectedRecordForCertificate.location}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Drinkability Index</span>
                  <p className="text-sm font-bold text-sky-600">{selectedRecordForCertificate.drinkabilityScore.toFixed(2)}%</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Compliance Status</span>
                  <p className="text-sm font-bold text-slate-900">{selectedRecordForCertificate.riskStatus}</p>
                </div>
              </div>

              {/* Tested 8 Parameters Matrix */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Physicochemical Laboratory Values</h4>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div className="p-2 border border-slate-200 rounded">
                    <span className="text-[10px] text-slate-400 block">pH</span>
                    <span className="font-mono font-bold">{selectedRecordForCertificate.ph}</span>
                  </div>
                  <div className="p-2 border border-slate-200 rounded">
                    <span className="text-[10px] text-slate-400 block">Turbidity</span>
                    <span className="font-mono font-bold">{selectedRecordForCertificate.turbidity} NTU</span>
                  </div>
                  <div className="p-2 border border-slate-200 rounded">
                    <span className="text-[10px] text-slate-400 block">Temp</span>
                    <span className="font-mono font-bold">{selectedRecordForCertificate.temperature}°C</span>
                  </div>
                  <div className="p-2 border border-slate-200 rounded">
                    <span className="text-[10px] text-slate-400 block">Dissolved O2</span>
                    <span className="font-mono font-bold">{selectedRecordForCertificate.do} mg/L</span>
                  </div>
                  <div className="p-2 border border-slate-200 rounded">
                    <span className="text-[10px] text-slate-400 block">BOD</span>
                    <span className="font-mono font-bold">{selectedRecordForCertificate.bod} mg/L</span>
                  </div>
                  <div className="p-2 border border-slate-200 rounded">
                    <span className="text-[10px] text-slate-400 block">Lead</span>
                    <span className="font-mono font-bold">{selectedRecordForCertificate.lead} mg/L</span>
                  </div>
                  <div className="p-2 border border-slate-200 rounded">
                    <span className="text-[10px] text-slate-400 block">Mercury</span>
                    <span className="font-mono font-bold">{selectedRecordForCertificate.mercury} mg/L</span>
                  </div>
                  <div className="p-2 border border-slate-200 rounded">
                    <span className="text-[10px] text-slate-400 block">Arsenic</span>
                    <span className="font-mono font-bold">{selectedRecordForCertificate.arsenic} mg/L</span>
                  </div>
                </div>
              </div>

              {/* Treatment Protocols */}
              <div className="text-xs text-slate-600 bg-sky-50 p-3 rounded-lg border border-sky-100">
                <span className="font-bold text-sky-900 block mb-1">Recommended Treatment Protocol:</span>
                <p>{selectedRecordForCertificate.recommendations?.join('; ') || 'Standard multi-barrier filtration.'}</p>
              </div>

              {/* Footer Signoff */}
              <div className="pt-6 border-t border-slate-200 flex justify-between items-end text-[10px] text-slate-400">
                <div>
                  <p>Certified by AquaSense AI Decision Support</p>
                  <p>Evaluation Model: XGBoost (0.9738 F1-Score)</p>
                </div>
                <div className="text-right">
                  <div className="w-32 border-b border-slate-300 mb-1"></div>
                  <p>Authorized Laboratory Analyst</p>
                </div>
              </div>
            </div>

            {/* Modal Action Buttons */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end space-x-3 no-print">
              <button
                onClick={() => setSelectedRecordForCertificate(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-colors flex items-center space-x-2 shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Certificate</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
