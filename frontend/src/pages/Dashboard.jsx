import React, { useState, useEffect } from 'react';
import {
  Activity,
  Droplet,
  AlertTriangle,
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
import apiClient from '../services/api';

export const Dashboard = () => {
  const [dashboardSummary, setDashboardSummary] = useState(null);
  const [trendDataPoints, setTrendDataPoints] = useState([]);
  const [locationSummaries, setLocationSummaries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadDashboardData = async () => {
    try {
      const [summaryResponse, trendsResponse, locationsResponse] = await Promise.all([
        apiClient.get('/analytics/summary'),
        apiClient.get('/analytics/trends?days=30'),
        apiClient.get('/analytics/locations')
      ]);

      if (summaryResponse.data?.success) {
        setDashboardSummary(summaryResponse.data.data);
      }
      if (trendsResponse.data?.success) {
        setTrendDataPoints(trendsResponse.data.data);
      }
      if (locationsResponse.data?.success) {
        setLocationSummaries(locationsResponse.data.data);
      }
    } catch (fetchError) {
      console.error('Failed to load dashboard data:', fetchError.message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    loadDashboardData();
  };

  // Pie chart risk distribution slices
  const riskDistributionSlices = dashboardSummary
    ? [
        { name: 'Safe (≥75%)', value: dashboardSummary.safeCount || 0, color: '#10b981' },
        { name: 'Moderate (40–74%)', value: dashboardSummary.moderateCount || 0, color: '#f59e0b' },
        { name: 'Critical (<40%)', value: dashboardSummary.criticalCount || 0, color: '#f43f5e' }
      ]
    : [];

  if (isLoading) {
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
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Environmental Lab Intelligence</h1>
          <p className="text-sm text-slate-500 mt-0.5">Continuous ML Drinkability Probability & Remediation Analytics</p>
        </div>
        <button
          onClick={handleManualRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center space-x-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-sm transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-sky-500' : ''}`} />
          <span>Sync Telemetry</span>
        </button>
      </div>

      {/* 4 Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1: Total Samples */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm hover:shadow transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Samples Tested</span>
            <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-slate-900">{dashboardSummary?.totalTests || 0}</span>
            <span className="text-xs text-slate-400 ml-2 font-medium">certified assays</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 flex items-center space-x-1">
            <span className="text-emerald-600 font-semibold">100%</span>
            <span>leakage-free evaluated</span>
          </p>
        </div>

        {/* KPI 2: Average Drinkability */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm hover:shadow transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Drinkability</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Droplet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-slate-900">{dashboardSummary?.averageDrinkability ?? 0}%</span>
            <span className="text-xs text-slate-400 ml-2 font-medium">fleet mean</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-emerald-500 h-1.5 rounded-full"
              style={{ width: `${Math.min(100, dashboardSummary?.averageDrinkability || 0)}%` }}
            ></div>
          </div>
        </div>

        {/* KPI 3: Critical Alerts */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm hover:shadow transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Critical Alerts</span>
            <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-rose-600">{dashboardSummary?.criticalCount || 0}</span>
            <span className="text-xs text-slate-400 ml-2 font-medium">samples &lt;40%</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Immediate treatment triggers active</p>
        </div>

        {/* KPI 4: Latest Sample */}
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
                dashboardSummary?.latestRecord?.riskStatus === 'Safe'
                  ? 'bg-emerald-100 text-emerald-800'
                  : dashboardSummary?.latestRecord?.riskStatus === 'Moderate'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {dashboardSummary?.latestRecord?.riskStatus || 'No Data'} (
              {(dashboardSummary?.latestRecord?.drinkabilityScore ?? 0).toFixed(1)}%)
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 truncate">
            Site: <span className="font-semibold text-slate-700">{dashboardSummary?.latestRecord?.location || 'N/A'}</span>
          </p>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Evolution Area Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Drinkability & pH Evolution</h2>
              <p className="text-xs text-slate-500">Chronological daily averages across all sampling stations</p>
            </div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
              <TrendingUp className="w-4 h-4 text-sky-600" />
              <span>30-Day Trend</span>
            </div>
          </div>

          <div className="h-72 w-full">
            {trendDataPoints.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendDataPoints} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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

        {/* Risk Distribution Donut Chart */}
        <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Risk Distribution</h2>
            <p className="text-xs text-slate-500">WHO compliant safety classification breakdown</p>
          </div>

          <div className="h-56 w-full my-auto">
            {dashboardSummary && dashboardSummary.totalTests > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistributionSlices}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {riskDistributionSlices.map((sliceItem, sliceIndex) => (
                      <Cell key={`slice-${sliceIndex}`} fill={sliceItem.color} />
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
              <p className="text-sm font-bold text-emerald-600">{dashboardSummary?.safeCount || 0}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Moderate</p>
              <p className="text-sm font-bold text-amber-600">{dashboardSummary?.moderateCount || 0}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Critical</p>
              <p className="text-sm font-bold text-rose-600">{dashboardSummary?.criticalCount || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Station Breakdown Bar Chart */}
      <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Sampling Site Comparison</h2>
            <p className="text-xs text-slate-500">Average drinkability score vs. critical alerts by station</p>
          </div>
          <div className="flex items-center space-x-1.5 text-xs text-slate-500">
            <MapPin className="w-4 h-4 text-sky-600" />
            <span>Station Breakdown</span>
          </div>
        </div>

        <div className="h-64 w-full">
          {locationSummaries.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={locationSummaries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
