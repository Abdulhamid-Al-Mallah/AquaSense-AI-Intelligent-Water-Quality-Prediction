import React, { useState } from 'react';
import {
  FlaskConical,
  UploadCloud,
  FileText,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  ArrowRight,
  Sparkles,
  Download,
  Info
} from 'lucide-react';
import api from '../services/api';

const SAMPLE_PRESETS = {
  clean: {
    label: 'Clean Natural Spring Water (Pristine)',
    data: {
      location: 'Mountain Spring Basin #4',
      ph: 7.6,
      turbidity: 1.8,
      temperature: 18.5,
      do: 8.4,
      bod: 1.5,
      lead: 0.003,
      mercury: 0.0003,
      arsenic: 0.003
    }
  },
  moderate: {
    label: 'Moderate Urban River Sample (Suspended Solids)',
    data: {
      location: 'Metro River Sector B',
      ph: 7.2,
      turbidity: 5.8,
      temperature: 25.0,
      do: 6.2,
      bod: 4.1,
      lead: 0.007,
      mercury: 0.0008,
      arsenic: 0.007
    }
  },
  critical: {
    label: 'Severe Heavy Metal Contamination (Industrial Runoff)',
    data: {
      location: 'Industrial Effluent Outflow #2',
      ph: 5.8,
      turbidity: 16.5,
      temperature: 31.0,
      do: 3.1,
      bod: 8.8,
      lead: 0.024,
      mercury: 0.0085,
      arsenic: 0.022
    }
  }
};

export const Analyze = () => {
  const [activeTab, setActiveTab] = useState('manual'); // 'manual' | 'bulk'

  // Manual Form State
  const [formData, setFormData] = useState({
    location: 'Main Municipal Intake',
    ph: 7.2,
    turbidity: 3.5,
    temperature: 22.0,
    do: 7.0,
    bod: 3.0,
    lead: 0.005,
    mercury: 0.0005,
    arsenic: 0.005
  });

  // Bulk State
  const [jsonText, setJsonText] = useState('');
  const [bulkRows, setBulkRows] = useState([]);
  const [bulkError, setBulkError] = useState('');

  // Result & Loading State
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // What-If Treatment Simulator State
  const [simulatorParams, setSimulatorParams] = useState(null);
  const [simulating, setSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);

  // Preset Handler
  const handleSelectPreset = (key) => {
    if (!key || !SAMPLE_PRESETS[key]) return;
    setFormData(SAMPLE_PRESETS[key].data);
  };

  const handleInputChange = (field, val) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === 'location' ? val : (val === '' ? '' : Number(val))
    }));
  };

  // Submit Manual Form
  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setAnalyzing(true);
    setError('');
    setResult(null);
    setSimulationResult(null);

    try {
      const res = await api.post('/predict', formData);
      if (res.data?.success) {
        setResult(res.data.data);
        setSimulatorParams({ ...formData });
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  // Parse Bulk JSON File / Paste
  const handleJsonUpload = (e) => {
    setBulkError('');
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (!Array.isArray(parsed)) {
          throw new Error('JSON file must contain an array of objects');
        }
        setBulkRows(parsed);
        setJsonText(JSON.stringify(parsed, null, 2));
      } catch (err) {
        setBulkError(`JSON Parse Error: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  const handleJsonPaste = (text) => {
    setJsonText(text);
    setBulkError('');
    if (!text.trim()) {
      setBulkRows([]);
      return;
    }
    try {
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed)) {
        throw new Error('Pasted content must be a JSON array of lab objects');
      }
      setBulkRows(parsed);
    } catch (err) {
      setBulkError(err.message);
    }
  };

  // Submit Bulk Records
  const handleBulkSubmit = async () => {
    if (!bulkRows.length) return;
    setAnalyzing(true);
    setError('');
    try {
      const res = await api.post('/predict', bulkRows);
      if (res.data?.success) {
        const last = Array.isArray(res.data.data) ? res.data.data[0] : res.data.data;
        setResult(last);
        setSimulatorParams({
          location: last.location,
          ph: last.ph,
          turbidity: last.turbidity,
          temperature: last.temperature,
          do: last.do,
          bod: last.bod,
          lead: last.lead,
          mercury: last.mercury,
          arsenic: last.arsenic
        });
        alert(`Successfully ingested & predicted ${res.data.count || bulkRows.length} water assays!`);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Bulk processing failed');
    } finally {
      setAnalyzing(false);
    }
  };

  // What-If Simulator Run
  const handleSimulateTreatment = async () => {
    if (!simulatorParams) return;
    setSimulating(true);
    try {
      const res = await api.post('/predict', simulatorParams);
      if (res.data?.success) {
        setSimulationResult(res.data.data);
      }
    } catch (err) {
      console.error('Simulator error:', err);
    } finally {
      setSimulating(false);
    }
  };

  const activeDisplay = simulationResult || result;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Laboratory Analysis & Simulator</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Ingest certified physicochemical assays, run XGBoost probability predictions, and explore remediation simulations
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 space-x-6">
        <button
          onClick={() => setActiveTab('manual')}
          className={`pb-3 text-sm font-semibold flex items-center space-x-2 border-b-2 transition-all ${
            activeTab === 'manual'
              ? 'border-sky-600 text-sky-600'
              : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          <FlaskConical className="w-4 h-4" />
          <span>Manual Lab Entry</span>
        </button>
        <button
          onClick={() => setActiveTab('bulk')}
          className={`pb-3 text-sm font-semibold flex items-center space-x-2 border-b-2 transition-all ${
            activeTab === 'bulk'
              ? 'border-sky-600 text-sky-600'
              : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          <span>Batch JSON Uploader</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center space-x-3 text-rose-700 text-xs">
          <AlertOctagon className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid: Form / Uploader Left (2 cols) vs Result Panel Right (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Input Panel */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'manual' ? (
            <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-5 border-b border-slate-100 gap-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900 tracking-tight">Physicochemical Sensor Assay</h2>
                  <p className="text-xs text-slate-500">Provide certified lab measurements across the 8 parameters</p>
                </div>
                {/* 1-Click Preset Dropdown */}
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <select
                    onChange={(e) => handleSelectPreset(e.target.value)}
                    defaultValue=""
                    className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-sky-500"
                  >
                    <option value="" disabled>Load Sample Preset (1-Click)...</option>
                    <option value="clean">Clean Natural Spring Water (Safe)</option>
                    <option value="moderate">Urban River Water (Moderate)</option>
                    <option value="critical">Industrial Heavy Metals (Critical)</option>
                  </select>
                </div>
              </div>

              <form onSubmit={handleManualSubmit} className="space-y-5">
                {/* Location Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Sampling Site / Station
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="e.g. Northern Reservoir Plant 2"
                  />
                </div>

                {/* 8 Parameters Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* pH */}
                  <div className="bg-slate-50/60 p-3 rounded-lg border border-slate-100">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-slate-700">pH Level</label>
                      <span className="text-[10px] text-slate-400 font-mono">0.0 - 14.0</span>
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.ph}
                      onChange={(e) => handleInputChange('ph', e.target.value)}
                      required
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-sm font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">WHO Safe: 6.5 – 8.5</p>
                  </div>

                  {/* Turbidity */}
                  <div className="bg-slate-50/60 p-3 rounded-lg border border-slate-100">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-slate-700">Turbidity (NTU)</label>
                      <span className="text-[10px] text-slate-400 font-mono">Nephelometric</span>
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.turbidity}
                      onChange={(e) => handleInputChange('turbidity', e.target.value)}
                      required
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-sm font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">WHO Safe: ≤ 5.0 NTU</p>
                  </div>

                  {/* Temperature */}
                  <div className="bg-slate-50/60 p-3 rounded-lg border border-slate-100">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-slate-700">Temperature (°C)</label>
                      <span className="text-[10px] text-slate-400 font-mono">Celsius</span>
                    </div>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.temperature}
                      onChange={(e) => handleInputChange('temperature', e.target.value)}
                      required
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-sm font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">Optimal: 15°C – 25°C</p>
                  </div>

                  {/* Dissolved Oxygen */}
                  <div className="bg-slate-50/60 p-3 rounded-lg border border-slate-100">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-slate-700">Dissolved Oxygen (DO)</label>
                      <span className="text-[10px] text-slate-400 font-mono">mg/L</span>
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.do}
                      onChange={(e) => handleInputChange('do', e.target.value)}
                      required
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-sm font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">WHO Healthy: ≥ 5.0 mg/L</p>
                  </div>

                  {/* BOD */}
                  <div className="bg-slate-50/60 p-3 rounded-lg border border-slate-100">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-slate-700">Biochemical Oxygen Demand (BOD)</label>
                      <span className="text-[10px] text-slate-400 font-mono">mg/L</span>
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.bod}
                      onChange={(e) => handleInputChange('bod', e.target.value)}
                      required
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-sm font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">WHO Safe: ≤ 5.0 mg/L</p>
                  </div>

                  {/* Lead */}
                  <div className="bg-slate-50/60 p-3 rounded-lg border border-slate-100">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-slate-700">Lead Concentration</label>
                      <span className="text-[10px] text-slate-400 font-mono">mg/L (ppm)</span>
                    </div>
                    <input
                      type="number"
                      step="0.0001"
                      value={formData.lead}
                      onChange={(e) => handleInputChange('lead', e.target.value)}
                      required
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-sm font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">WHO Max Limit: ≤ 0.010 mg/L</p>
                  </div>

                  {/* Mercury */}
                  <div className="bg-slate-50/60 p-3 rounded-lg border border-slate-100">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-slate-700">Mercury Concentration</label>
                      <span className="text-[10px] text-slate-400 font-mono">mg/L (ppm)</span>
                    </div>
                    <input
                      type="number"
                      step="0.0001"
                      value={formData.mercury}
                      onChange={(e) => handleInputChange('mercury', e.target.value)}
                      required
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-sm font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">WHO Max Limit: ≤ 0.006 mg/L</p>
                  </div>

                  {/* Arsenic */}
                  <div className="bg-slate-50/60 p-3 rounded-lg border border-slate-100">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-slate-700">Arsenic Concentration</label>
                      <span className="text-[10px] text-slate-400 font-mono">mg/L (ppm)</span>
                    </div>
                    <input
                      type="number"
                      step="0.0001"
                      value={formData.arsenic}
                      onChange={(e) => handleInputChange('arsenic', e.target.value)}
                      required
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-sm font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">WHO Max Limit: ≤ 0.010 mg/L</p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={analyzing}
                  className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg text-sm transition-all flex items-center justify-center space-x-2 shadow-lg shadow-sky-600/20 disabled:opacity-50"
                >
                  {analyzing ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Execute Machine Learning Inference</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* Bulk JSON Tab */
            <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">Batch JSON Data Ingestion</h2>
                <p className="text-xs text-slate-500">Upload a `.json` file or paste an array of certified lab assay documents</p>
              </div>

              {/* Drag/Drop Box */}
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors">
                <UploadCloud className="w-10 h-10 text-sky-500 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700">Upload laboratory assay file (.json)</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Supports multi-station batches up to 5MB</p>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleJsonUpload}
                  className="mt-4 block mx-auto text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
                />
              </div>

              {/* JSON Textarea */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-700">Or Paste Raw JSON Array</label>
                  <button
                    type="button"
                    onClick={() => {
                      const sample = [
                        SAMPLE_PRESETS.clean.data,
                        SAMPLE_PRESETS.moderate.data,
                        SAMPLE_PRESETS.critical.data
                      ];
                      setJsonText(JSON.stringify(sample, null, 2));
                      setBulkRows(sample);
                    }}
                    className="text-[11px] text-sky-600 hover:underline font-semibold"
                  >
                    Insert 3-Sample Demo Array
                  </button>
                </div>
                <textarea
                  rows={6}
                  value={jsonText}
                  onChange={(e) => handleJsonPaste(e.target.value)}
                  placeholder='[ { "location": "Site A", "ph": 7.4, "turbidity": 2.5, ... } ]'
                  className="w-full p-3 font-mono text-xs bg-slate-900 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                ></textarea>
                {bulkError && <p className="text-xs text-rose-500 mt-1 font-semibold">{bulkError}</p>}
              </div>

              {/* Preview Table */}
              {bulkRows.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Parsed Batch Preview ({bulkRows.length} rows)
                  </h3>
                  <div className="overflow-x-auto border border-slate-200 rounded-lg max-h-48">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-500 sticky top-0 border-b border-slate-200">
                        <tr>
                          <th className="p-2">Location</th>
                          <th className="p-2">pH</th>
                          <th className="p-2">Turbidity</th>
                          <th className="p-2">DO</th>
                          <th className="p-2">Lead</th>
                          <th className="p-2">Mercury</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {bulkRows.slice(0, 5).map((row, idx) => (
                          <tr key={idx}>
                            <td className="p-2 font-medium">{row.location || 'N/A'}</td>
                            <td className="p-2">{row.ph ?? row.pH}</td>
                            <td className="p-2">{row.turbidity ?? row['Turbidity (NTU)']}</td>
                            <td className="p-2">{row.do ?? row['DO (mg/L)']}</td>
                            <td className="p-2">{row.lead ?? row['Lead (mg/L)']}</td>
                            <td className="p-2">{row.mercury ?? row['Mercury (mg/L)']}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleBulkSubmit}
                disabled={analyzing || bulkRows.length === 0}
                className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg text-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {analyzing ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Submit Batch for ML Prediction</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* What-If Treatment Simulator Panel */}
          {simulatorParams && (
            <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <Sliders className="w-4 h-4 text-sky-600" />
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight">"What-If" Water Treatment Simulator</h3>
                </div>
                <span className="text-[11px] text-sky-600 font-semibold bg-sky-50 px-2 py-0.5 rounded-full">
                  Interactive Sensitivity Analysis
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Adjust hypothetical post-treatment values below to simulate how water filtration, coagulation, or reverse osmosis improves the continuous Drinkability Score.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Turbidity Slider */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Turbidity Reduction</span>
                    <span className="text-sky-600 font-mono">{simulatorParams.turbidity} NTU</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="20"
                    step="0.1"
                    value={simulatorParams.turbidity}
                    onChange={(e) =>
                      setSimulatorParams((p) => ({ ...p, turbidity: Number(e.target.value) }))
                    }
                    className="w-full accent-sky-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>0.5 NTU (Pure)</span>
                    <span>20 NTU (Turbid)</span>
                  </div>
                </div>

                {/* Lead Slider */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Lead Removal (RO)</span>
                    <span className="text-sky-600 font-mono">{simulatorParams.lead} mg/L</span>
                  </div>
                  <input
                    type="range"
                    min="0.0001"
                    max="0.03"
                    step="0.0005"
                    value={simulatorParams.lead}
                    onChange={(e) =>
                      setSimulatorParams((p) => ({ ...p, lead: Number(e.target.value) }))
                    }
                    className="w-full accent-sky-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>0.0001 mg/L</span>
                    <span>0.03 mg/L</span>
                  </div>
                </div>

                {/* Mercury Slider */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Mercury Removal (Carbon)</span>
                    <span className="text-sky-600 font-mono">{simulatorParams.mercury} mg/L</span>
                  </div>
                  <input
                    type="range"
                    min="0.00001"
                    max="0.01"
                    step="0.0002"
                    value={simulatorParams.mercury}
                    onChange={(e) =>
                      setSimulatorParams((p) => ({ ...p, mercury: Number(e.target.value) }))
                    }
                    className="w-full accent-sky-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Trace</span>
                    <span>0.01 mg/L</span>
                  </div>
                </div>

                {/* Dissolved Oxygen Slider */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Aeration (DO Level)</span>
                    <span className="text-sky-600 font-mono">{simulatorParams.do} mg/L</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="10"
                    step="0.1"
                    value={simulatorParams.do}
                    onChange={(e) =>
                      setSimulatorParams((p) => ({ ...p, do: Number(e.target.value) }))
                    }
                    className="w-full accent-sky-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>2 mg/L</span>
                    <span>10 mg/L</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSimulateTreatment}
                disabled={simulating}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs transition-all flex items-center justify-center space-x-2"
              >
                {simulating ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                    <span>Re-Simulate Post-Treatment Prediction</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Live Decision-Support & Remediation Output */}
        <div className="space-y-6">
          {activeDisplay ? (
            <div className="space-y-6">
              {/* Score Gauge Card */}
              <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm text-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Calculated Drinkability Probability
                </span>

                {/* Circular Gauge Representation */}
                <div className="my-5 relative inline-flex items-center justify-center">
                  <div className="w-36 h-36 rounded-full border-8 border-slate-100 flex items-center justify-center relative">
                    <div
                      className={`w-36 h-36 rounded-full border-8 absolute transition-all duration-700 ${
                        activeDisplay.riskStatus === 'Safe'
                          ? 'border-emerald-500 border-t-transparent'
                          : activeDisplay.riskStatus === 'Moderate'
                          ? 'border-amber-500 border-t-transparent'
                          : 'border-rose-500 border-t-transparent'
                      }`}
                      style={{
                        transform: `rotate(${Math.round((activeDisplay.drinkabilityScore / 100) * 360)}deg)`
                      }}
                    ></div>
                    <div className="flex flex-col items-center">
                      <span className="text-3xl font-black text-slate-900 tracking-tight">
                        {activeDisplay.drinkabilityScore.toFixed(1)}%
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Continuous</span>
                    </div>
                  </div>
                </div>

                {/* Risk Status Pill */}
                <div>
                  <span
                    className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      activeDisplay.riskStatus === 'Safe'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : activeDisplay.riskStatus === 'Moderate'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}
                  >
                    {activeDisplay.riskStatus === 'Safe' ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5" />
                    )}
                    <span>{activeDisplay.riskStatus} Classification</span>
                  </span>
                </div>
              </div>

              {/* Regulatory Parameter Thresholds Progress Bars */}
              <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm space-y-3">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  WHO Critical Threshold Checks
                </h3>

                <div className="space-y-2.5 text-xs">
                  {/* Lead Bar */}
                  <div>
                    <div className="flex justify-between text-[11px] font-medium mb-1">
                      <span>Lead ({activeDisplay.lead} mg/L)</span>
                      <span className={activeDisplay.lead <= 0.01 ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                        {activeDisplay.lead <= 0.01 ? 'PASS (≤0.010)' : 'EXCEEDED'}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${activeDisplay.lead <= 0.01 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                        style={{ width: `${Math.min(100, (activeDisplay.lead / 0.02) * 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Turbidity Bar */}
                  <div>
                    <div className="flex justify-between text-[11px] font-medium mb-1">
                      <span>Turbidity ({activeDisplay.turbidity} NTU)</span>
                      <span className={activeDisplay.turbidity <= 5.0 ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                        {activeDisplay.turbidity <= 5.0 ? 'PASS (≤5.0)' : 'EXCEEDED'}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${activeDisplay.turbidity <= 5.0 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                        style={{ width: `${Math.min(100, (activeDisplay.turbidity / 15) * 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Arsenic Bar */}
                  <div>
                    <div className="flex justify-between text-[11px] font-medium mb-1">
                      <span>Arsenic ({activeDisplay.arsenic} mg/L)</span>
                      <span className={activeDisplay.arsenic <= 0.01 ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                        {activeDisplay.arsenic <= 0.01 ? 'PASS (≤0.010)' : 'EXCEEDED'}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${activeDisplay.arsenic <= 0.01 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                        style={{ width: `${Math.min(100, (activeDisplay.arsenic / 0.02) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actionable Treatment Recommendations Card */}
              <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Remediation & Action Plan
                  </h3>
                </div>

                {/* Warnings */}
                {activeDisplay.warnings?.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold text-slate-500 uppercase">Detected Alerts</p>
                    {activeDisplay.warnings.map((w, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                        <span>{w}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Recommendations */}
                {activeDisplay.recommendations?.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <p className="text-[11px] font-bold text-slate-500 uppercase">Recommended Interventions</p>
                    {activeDisplay.recommendations.map((r, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-sky-50 border border-sky-200 text-sky-900 text-xs flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-sky-600 mt-0.5" />
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-8 border border-slate-200/80 shadow-sm text-center">
              <FlaskConical className="w-12 h-12 text-slate-300 mx-auto mb-3 animate-pulse" />
              <h3 className="text-sm font-bold text-slate-800">Awaiting Lab Telemetry</h3>
              <p className="text-xs text-slate-400 mt-1">
                Fill the 8 parameters or load a sample preset and click Execute Inference to see the live drinkability score and treatment recommendations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
