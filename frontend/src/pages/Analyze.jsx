import React, { useState } from 'react';
import {
  FlaskConical,
  UploadCloud,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import apiClient from '../services/api';

// Realistic sample presets for quick demonstrations
const DEMO_PRESET_SAMPLES = {
  cleanSpringWater: {
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
  urbanRiverWater: {
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
  industrialEffluent: {
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
  const [selectedTab, setSelectedTab] = useState('manual'); // 'manual' | 'bulk'

  // Manual Form Input State
  const [sampleFormData, setSampleFormData] = useState({
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

  // Bulk JSON Upload & Paste State
  const [rawJsonText, setRawJsonText] = useState('');
  const [parsedBatchSamples, setParsedBatchSamples] = useState([]);
  const [batchParseError, setBatchParseError] = useState('');

  // ML Prediction Execution State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [submissionError, setSubmissionError] = useState('');

  // What-If Treatment Simulator State
  const [treatmentSimulatorValues, setTreatmentSimulatorValues] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);

  // Load 1-Click Preset
  const handleSelectPreset = (presetKey) => {
    if (!presetKey || !DEMO_PRESET_SAMPLES[presetKey]) return;
    setSampleFormData(DEMO_PRESET_SAMPLES[presetKey].data);
  };

  const handleFormFieldChange = (fieldName, newValue) => {
    setSampleFormData((previousState) => ({
      ...previousState,
      [fieldName]: fieldName === 'location' ? newValue : (newValue === '' ? '' : Number(newValue))
    }));
  };

  // Submit Manual Single-Sample Form
  const handleManualFormSubmit = async (event) => {
    event.preventDefault();
    setIsAnalyzing(true);
    setSubmissionError('');
    setPredictionResult(null);
    setSimulationResult(null);

    try {
      const response = await apiClient.post('/predict', sampleFormData);
      if (response.data?.success) {
        setPredictionResult(response.data.data);
        setTreatmentSimulatorValues({ ...sampleFormData });
      }
    } catch (requestError) {
      const message = requestError.response?.data?.error || requestError.message || 'Analysis could not be completed.';
      setSubmissionError(message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle Uploading a .json or .csv file
  const handleFileUpload = (event) => {
    setBatchParseError('');
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile) return;

    const fileName = uploadedFile.name.toLowerCase();
    const isCsv = fileName.endsWith('.csv');

    const fileReader = new FileReader();
    fileReader.onload = (fileEvent) => {
      try {
        const textContent = fileEvent.target.result;
        if (isCsv) {
          // Parse CSV text into array of sample objects
          const lines = textContent.split(/\r?\n/).filter((l) => l.trim().length > 0);
          if (lines.length < 2) {
            throw new Error('CSV must contain a header row and at least one data row.');
          }

          const rawHeaders = lines[0].split(',').map((h) => h.trim().replace(/^["']|["']$/g, ''));
          const cleanHeaders = rawHeaders.map((h) => {
            const low = h.toLowerCase();
            if (low.includes('ph')) return 'ph';
            if (low.includes('turbid')) return 'turbidity';
            if (low.includes('temp')) return 'temperature';
            if (low === 'do' || low.includes('dissolved')) return 'do';
            if (low === 'bod' || low.includes('bio')) return 'bod';
            if (low.includes('lead')) return 'lead';
            if (low.includes('merc')) return 'mercury';
            if (low.includes('arsen')) return 'arsenic';
            if (low.includes('loc')) return 'location';
            return h;
          });

          const parsedRows = [];
          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map((v) => v.trim().replace(/^["']|["']$/g, ''));
            if (values.length < cleanHeaders.length) continue;

            const rowObj = { location: 'Imported CSV Station' };
            cleanHeaders.forEach((hdr, idx) => {
              const val = values[idx];
              if (hdr === 'location') {
                rowObj.location = val || 'Imported Station';
              } else {
                rowObj[hdr] = isNaN(Number(val)) ? 0 : Number(val);
              }
            });
            parsedRows.push(rowObj);
          }

          if (parsedRows.length === 0) {
            throw new Error('No valid numeric data rows could be extracted from the CSV file.');
          }

          setParsedBatchSamples(parsedRows);
          setRawJsonText(JSON.stringify(parsedRows.slice(0, 5), null, 2) + `\n// ... (${parsedRows.length} total rows parsed from ${uploadedFile.name})`);
        } else {
          const parsedContent = JSON.parse(textContent);
          if (!Array.isArray(parsedContent)) {
            throw new Error('The uploaded JSON file must contain an array of sample objects.');
          }
          setParsedBatchSamples(parsedContent);
          setRawJsonText(JSON.stringify(parsedContent, null, 2));
        }
      } catch (parseError) {
        setBatchParseError(`File Read Error: ${parseError.message}`);
      }
    };
    fileReader.readAsText(uploadedFile);
  };

  // Handle Pasting raw JSON in textarea
  const handleJsonPaste = (text) => {
    setRawJsonText(text);
    setBatchParseError('');
    if (!text.trim()) {
      setParsedBatchSamples([]);
      return;
    }
    try {
      const parsedContent = JSON.parse(text);
      if (!Array.isArray(parsedContent)) {
        throw new Error('Pasted text must be a JSON array of sample objects.');
      }
      setParsedBatchSamples(parsedContent);
    } catch (parseError) {
      setBatchParseError(parseError.message);
    }
  };

  // Submit Bulk Batch to Backend
  const handleBatchSubmit = async () => {
    if (parsedBatchSamples.length === 0) return;
    setIsAnalyzing(true);
    setSubmissionError('');

    try {
      const response = await apiClient.post('/predict', parsedBatchSamples);
      if (response.data?.success) {
        const lastSample = Array.isArray(response.data.data) ? response.data.data[0] : response.data.data;
        setPredictionResult(lastSample);
        setTreatmentSimulatorValues({
          location: lastSample.location,
          ph: lastSample.ph,
          turbidity: lastSample.turbidity,
          temperature: lastSample.temperature,
          do: lastSample.do,
          bod: lastSample.bod,
          lead: lastSample.lead,
          mercury: lastSample.mercury,
          arsenic: lastSample.arsenic
        });
        alert(`Successfully processed and saved ${response.data.count || parsedBatchSamples.length} water samples.`);
      }
    } catch (requestError) {
      const message = requestError.response?.data?.error || requestError.message || 'Batch prediction failed.';
      setSubmissionError(message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Re-run inference with adjusted simulator parameters
  const handleRunTreatmentSimulation = async () => {
    if (!treatmentSimulatorValues) return;
    setIsSimulating(true);

    try {
      const response = await apiClient.post('/predict', treatmentSimulatorValues);
      if (response.data?.success) {
        setSimulationResult(response.data.data);
      }
    } catch (simulationError) {
      console.error('Treatment simulation error:', simulationError.message);
    } finally {
      setIsSimulating(false);
    }
  };

  const currentActiveDisplay = simulationResult || predictionResult;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Laboratory Analysis & Simulator</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Enter water-quality parameters, run XGBoost predictions, and explore hypothetical treatment adjustments
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 space-x-6">
        <button
          onClick={() => setSelectedTab('manual')}
          className={`pb-3 text-sm font-semibold flex items-center space-x-2 border-b-2 transition-all ${
            selectedTab === 'manual'
              ? 'border-sky-600 text-sky-600'
              : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          <FlaskConical className="w-4 h-4" />
          <span>Manual Lab Entry</span>
        </button>
        <button
          onClick={() => setSelectedTab('bulk')}
          className={`pb-3 text-sm font-semibold flex items-center space-x-2 border-b-2 transition-all ${
            selectedTab === 'bulk'
              ? 'border-sky-600 text-sky-600'
              : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          <span>Batch JSON Uploader</span>
        </button>
      </div>

      {submissionError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center space-x-3 text-rose-700 text-xs">
          <AlertOctagon className="w-4 h-4 shrink-0" />
          <span>{submissionError}</span>
        </div>
      )}

      {/* Grid: Form / Uploader Left (2 cols) vs Result Panel Right (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Input Panel */}
        <div className="lg:col-span-2 space-y-6">
          {selectedTab === 'manual' ? (
            <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-5 border-b border-slate-100 gap-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900 tracking-tight">Physicochemical Sensor Assay</h2>
                  <p className="text-xs text-slate-500">Provide measurements for the eight model input parameters</p>
                </div>
                {/* 1-Click Preset Dropdown */}
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <select
                    onChange={(event) => handleSelectPreset(event.target.value)}
                    defaultValue=""
                    className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-sky-500"
                  >
                    <option value="" disabled>Load Sample Preset (1-Click)...</option>
                    <option value="cleanSpringWater">Clean Natural Spring Water (Safe)</option>
                    <option value="urbanRiverWater">Urban River Water (Moderate)</option>
                    <option value="industrialEffluent">Industrial Heavy Metals (Critical)</option>
                  </select>
                </div>
              </div>

              <form onSubmit={handleManualFormSubmit} className="space-y-5">
                {/* Location Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Sampling Site / Station
                  </label>
                  <input
                    type="text"
                    value={sampleFormData.location}
                    onChange={(event) => handleFormFieldChange('location', event.target.value)}
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
                      value={sampleFormData.ph}
                      onChange={(event) => handleFormFieldChange('ph', event.target.value)}
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
                      value={sampleFormData.turbidity}
                      onChange={(event) => handleFormFieldChange('turbidity', event.target.value)}
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
                      value={sampleFormData.temperature}
                      onChange={(event) => handleFormFieldChange('temperature', event.target.value)}
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
                      value={sampleFormData.do}
                      onChange={(event) => handleFormFieldChange('do', event.target.value)}
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
                      value={sampleFormData.bod}
                      onChange={(event) => handleFormFieldChange('bod', event.target.value)}
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
                      value={sampleFormData.lead}
                      onChange={(event) => handleFormFieldChange('lead', event.target.value)}
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
                      value={sampleFormData.mercury}
                      onChange={(event) => handleFormFieldChange('mercury', event.target.value)}
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
                      value={sampleFormData.arsenic}
                      onChange={(event) => handleFormFieldChange('arsenic', event.target.value)}
                      required
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-sm font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">WHO Max Limit: ≤ 0.010 mg/L</p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isAnalyzing}
                  className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg text-sm transition-all flex items-center justify-center space-x-2 shadow-lg shadow-sky-600/20 disabled:opacity-50"
                >
                  {isAnalyzing ? (
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
            /* Bulk CSV / JSON Tab */
            <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">Batch CSV & JSON Dataset Ingestion</h2>
                <p className="text-xs text-slate-500">Upload a `.csv` or `.json` dataset file, or paste an array of water measurements</p>
              </div>

              {/* Upload Drop Zone */}
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors">
                <UploadCloud className="w-10 h-10 text-sky-500 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700">Upload laboratory dataset (.csv or .json)</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Supports multi-station batches and time-series records up to 5MB</p>
                <input
                  type="file"
                  accept=".csv, .json"
                  onChange={handleFileUpload}
                  className="mt-4 block mx-auto text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
                />
              </div>

              {/* Paste JSON Textarea */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-700">Or Paste Raw JSON Array</label>
                  <button
                    type="button"
                    onClick={() => {
                      const demoArray = [
                        DEMO_PRESET_SAMPLES.cleanSpringWater.data,
                        DEMO_PRESET_SAMPLES.urbanRiverWater.data,
                        DEMO_PRESET_SAMPLES.industrialEffluent.data
                      ];
                      setRawJsonText(JSON.stringify(demoArray, null, 2));
                      setParsedBatchSamples(demoArray);
                    }}
                    className="text-[11px] text-sky-600 hover:underline font-semibold"
                  >
                    Insert 3-Sample Demo Array
                  </button>
                </div>
                <textarea
                  rows={6}
                  value={rawJsonText}
                  onChange={(event) => handleJsonPaste(event.target.value)}
                  placeholder='[ { "location": "Site A", "ph": 7.4, "turbidity": 2.5, ... } ]'
                  className="w-full p-3 font-mono text-xs bg-slate-900 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                ></textarea>
                {batchParseError && <p className="text-xs text-rose-500 mt-1 font-semibold">{batchParseError}</p>}
              </div>

              {/* Table Preview of Batch Rows */}
              {parsedBatchSamples.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Parsed Batch Preview ({parsedBatchSamples.length} rows)
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
                        {parsedBatchSamples.slice(0, 5).map((rowItem, index) => (
                          <tr key={index}>
                            <td className="p-2 font-medium">{rowItem.location || 'N/A'}</td>
                            <td className="p-2">{rowItem.ph ?? rowItem.pH}</td>
                            <td className="p-2">{rowItem.turbidity ?? rowItem['Turbidity (NTU)']}</td>
                            <td className="p-2">{rowItem.do ?? rowItem['DO (mg/L)']}</td>
                            <td className="p-2">{rowItem.lead ?? rowItem['Lead (mg/L)']}</td>
                            <td className="p-2">{rowItem.mercury ?? rowItem['Mercury (mg/L)']}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleBatchSubmit}
                disabled={isAnalyzing || parsedBatchSamples.length === 0}
                className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg text-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isAnalyzing ? (
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

          {/* What-If Treatment Simulator */}
          {treatmentSimulatorValues && (
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
                    <span className="text-sky-600 font-mono">{treatmentSimulatorValues.turbidity} NTU</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="20"
                    step="0.1"
                    value={treatmentSimulatorValues.turbidity}
                    onChange={(event) =>
                      setTreatmentSimulatorValues((prev) => ({ ...prev, turbidity: Number(event.target.value) }))
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
                    <span className="text-sky-600 font-mono">{treatmentSimulatorValues.lead} mg/L</span>
                  </div>
                  <input
                    type="range"
                    min="0.0001"
                    max="0.03"
                    step="0.0005"
                    value={treatmentSimulatorValues.lead}
                    onChange={(event) =>
                      setTreatmentSimulatorValues((prev) => ({ ...prev, lead: Number(event.target.value) }))
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
                    <span className="text-sky-600 font-mono">{treatmentSimulatorValues.mercury} mg/L</span>
                  </div>
                  <input
                    type="range"
                    min="0.00001"
                    max="0.01"
                    step="0.0002"
                    value={treatmentSimulatorValues.mercury}
                    onChange={(event) =>
                      setTreatmentSimulatorValues((prev) => ({ ...prev, mercury: Number(event.target.value) }))
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
                    <span className="text-sky-600 font-mono">{treatmentSimulatorValues.do} mg/L</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="10"
                    step="0.1"
                    value={treatmentSimulatorValues.do}
                    onChange={(event) =>
                      setTreatmentSimulatorValues((prev) => ({ ...prev, do: Number(event.target.value) }))
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
                onClick={handleRunTreatmentSimulation}
                disabled={isSimulating}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs transition-all flex items-center justify-center space-x-2"
              >
                {isSimulating ? (
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

        {/* Right Side: Live Results & Regulatory Guidance */}
        <div className="space-y-6">
          {currentActiveDisplay ? (
            <div className="space-y-6">
              {/* Score Gauge Card */}
              <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm text-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Calculated Drinkability Probability
                </span>

                <div className="my-5 relative inline-flex items-center justify-center">
                  <div className="w-36 h-36 rounded-full border-8 border-slate-100 flex items-center justify-center relative">
                    <div
                      className={`w-36 h-36 rounded-full border-8 absolute transition-all duration-700 ${
                        currentActiveDisplay.riskStatus === 'Safe'
                          ? 'border-emerald-500 border-t-transparent'
                          : currentActiveDisplay.riskStatus === 'Moderate'
                          ? 'border-amber-500 border-t-transparent'
                          : 'border-rose-500 border-t-transparent'
                      }`}
                      style={{
                        transform: `rotate(${Math.round((currentActiveDisplay.drinkabilityScore / 100) * 360)}deg)`
                      }}
                    ></div>
                    <div className="flex flex-col items-center">
                      <span className="text-3xl font-black text-slate-900 tracking-tight">
                        {currentActiveDisplay.drinkabilityScore.toFixed(1)}%
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Continuous</span>
                    </div>
                  </div>
                </div>

                <div>
                  <span
                    className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      currentActiveDisplay.riskStatus === 'Safe'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : currentActiveDisplay.riskStatus === 'Moderate'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}
                  >
                    {currentActiveDisplay.riskStatus === 'Safe' ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5" />
                    )}
                    <span>{currentActiveDisplay.riskStatus} Classification</span>
                  </span>

                  {currentActiveDisplay.isAnomaly && (
                    <div className="mt-3 p-2.5 bg-amber-50 border border-amber-300 rounded-lg text-amber-800 text-xs font-semibold flex items-center justify-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Multivariate Hydrological Anomaly (Score: {currentActiveDisplay.anomalyScore})</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Threshold Comparison Bars */}
              <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm space-y-3">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  WHO Critical Threshold Checks
                </h3>

                <div className="space-y-2.5 text-xs">
                  {/* Lead Bar */}
                  <div>
                    <div className="flex justify-between text-[11px] font-medium mb-1">
                      <span>Lead ({currentActiveDisplay.lead} mg/L)</span>
                      <span className={currentActiveDisplay.lead <= 0.01 ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                        {currentActiveDisplay.lead <= 0.01 ? 'PASS (≤0.010)' : 'EXCEEDED'}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${currentActiveDisplay.lead <= 0.01 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                        style={{ width: `${Math.min(100, (currentActiveDisplay.lead / 0.02) * 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Turbidity Bar */}
                  <div>
                    <div className="flex justify-between text-[11px] font-medium mb-1">
                      <span>Turbidity ({currentActiveDisplay.turbidity} NTU)</span>
                      <span className={currentActiveDisplay.turbidity <= 5.0 ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                        {currentActiveDisplay.turbidity <= 5.0 ? 'PASS (≤5.0)' : 'EXCEEDED'}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${currentActiveDisplay.turbidity <= 5.0 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                        style={{ width: `${Math.min(100, (currentActiveDisplay.turbidity / 15) * 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Arsenic Bar */}
                  <div>
                    <div className="flex justify-between text-[11px] font-medium mb-1">
                      <span>Arsenic ({currentActiveDisplay.arsenic} mg/L)</span>
                      <span className={currentActiveDisplay.arsenic <= 0.01 ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                        {currentActiveDisplay.arsenic <= 0.01 ? 'PASS (≤0.010)' : 'EXCEEDED'}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${currentActiveDisplay.arsenic <= 0.01 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                        style={{ width: `${Math.min(100, (currentActiveDisplay.arsenic / 0.02) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actionable Treatment Protocols Card */}
              <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Remediation & Action Plan
                  </h3>
                </div>

                {/* Warnings List */}
                {currentActiveDisplay.warnings?.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold text-slate-500 uppercase">Detected Alerts</p>
                    {currentActiveDisplay.warnings.map((warningText, index) => (
                      <div key={index} className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                        <span>{warningText}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Recommendations List */}
                {currentActiveDisplay.recommendations?.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <p className="text-[11px] font-bold text-slate-500 uppercase">Recommended Interventions</p>
                    {currentActiveDisplay.recommendations.map((recommendationText, index) => (
                      <div key={index} className="p-2.5 rounded-lg bg-sky-50 border border-sky-200 text-sky-900 text-xs flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-sky-600 mt-0.5" />
                        <span>{recommendationText}</span>
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
