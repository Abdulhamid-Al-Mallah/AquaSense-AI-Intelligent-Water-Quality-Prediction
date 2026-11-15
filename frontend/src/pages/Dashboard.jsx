import React, { useState, useEffect } from 'react';
import {
  Activity,
  Droplet,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  MapPin,
  RefreshCw,
  Clock
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import api from '../services/api';

export const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [sumRes, trendRes, locRes] = await Promise.all([
        api.get('/analytics/summary'),
        api.get('/analytics/trends?days=30'),
        api.get('/analytics/locations')
      ]);

      if (sumRes.data?.success) setSummary(sumRes.data.data);
      if (trendRes.data?.success) setTrends(trendRes.data.data);
      if (locRes.data?.success) setLocations(locRes.data.data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  // Prepare Pie Chart Data
  const pieData = summary
    ? [
        { name: 'Safe (≥75%)', value: summary.safeCount || 0, color: '#10b981' },
        { name: 'Moderate (40–74%)', value: summary.moderateCount || 0, color: '#f59e0b' },
        { name: 'Critical (<40%)', value: summary.criticalCount || 0, color: '#f43f5e' }
      ]
    : [];

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-slate-500 tracking-wider uppercase">Loading Laboratory Telemetry...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Welcome & Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Environmental Lab Intelligence</h1>
          <p className="text-sm text-slate-500 mt-0.5">Continuous ML Drinkability Probability & Remediation Analytics</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center space-x-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-sm transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-sky-500' : ''}`} />
          <span>Sync Telemetry</span>
        </button>
      </div>

      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm hover:shadow transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Samples Tested</span>
            <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-slate-900">{summary?.totalTests || 0}</span>
            <span className="text-xs text-slate-400 ml-2 font-medium">certified assays</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 flex items-center space-x-1">
            <span className="text-emerald-600 font-semibold">100%</span>
            <span>leakage-free evaluated</span>
          </p>
        </div>

        {/* KPI 2 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm hover:shadow transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Drinkability</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Droplet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-slate-900">{summary?.averageDrinkability ?? 0}%</span>
            <span className="text-xs text-slate-400 ml-2 font-medium">fleet mean</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-emerald-500 h-1.5 rounded-full"
              style={{ width: `${Math.min(100, summary?.averageDrinkability || 0)}%` }}
            ></div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm hover:shadow transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Critical Alerts</span>
            <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-rose-600">{summary?.criticalCount || 0}</span>
            <span className="text-xs text-slate-400 ml-2 font-medium">samples &lt;40%</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Immediate treatment triggers active</p>
        </div>

        {/* KPI 4 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm hover:shadow transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Latest Sample</span>
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                summary?.latestRecord?.riskStatus === 'Safe'
                  ? 'bg-emerald-100 text-emerald-800'
                  : summary?.latestRecord?.riskStatus === 'Moderate'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {summary?.latestRecord?.riskStatus || 'No Data'} ({(summary?.latestRecord?.drinkabilityScore ?? 0).toFixed(1)}%)
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 truncate">
            Site: <span className="font-semibold text-slate-700">{summary?.latestRecord?.location || 'N/A'}</span>
          </p>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Area Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Drinkability & pH Evolution</h2>
              <p className="text-xs text-slate-500">Chronological moving averages across all monitoring stations</p>
            </div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
              <TrendingUp className="w-4 h-4 text-sky-600" />
              <span>30-Day Trend</span>
            </div>
          </div>

          <div className="h-72 w-full">
            {trends.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                      border: 'none'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Area
                    type="monotone"
                    dataKey="avgDrinkability"
                    name="Drinkability Score (%)"
                    stroke="#0284c7"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#scoreColor)"
                  />
                  <Area
                    type="monotone"
                    dataKey="avgPh"
                    name="Average pH"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="none"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No time-series assays recorded yet. Run a prediction in the Lab tab to populate trends.
              </div>
            )}
          </div>
        </div>

        {/* Risk Distribution Donut Chart (1 col) */}
        <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Risk Distribution</h2>
            <p className="text-xs text-slate-500">WHO compliant safety classification breakdown</p>
          </div>

          <div className="h-56 w-full my-auto">
            {summary && summary.totalTests > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                      border: 'none'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                Awaiting sample records.
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 text-center">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Safe</p>
              <p className="text-sm font-bold text-emerald-600">{summary?.safeCount || 0}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Moderate</p>
              <p className="text-sm font-bold text-amber-600">{summary?.moderateCount || 0}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Critical</p>
              <p className="text-sm font-bold text-rose-600">{summary?.criticalCount || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Location Site Comparison Bar Chart */}
      <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Sampling Site Comparison</h2>
            <p className="text-xs text-slate-500">Average drinkability score vs. critical alert incidents by station</p>
          </div>
          <div className="flex items-center space-x-1.5 text-xs text-slate-500">
            <MapPin className="w-4 h-4 text-sky-600" />
            <span>Station Breakdown</span>
          </div>
        </div>

        <div className="h-64 w-full">
          {locations.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={locations} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="location" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                    border: 'none'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                <Bar dataKey="avgDrinkability" name="Avg Drinkability (%)" fill="#0284c7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="criticalCount" name="Critical Alerts" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              No geographical station records available yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
