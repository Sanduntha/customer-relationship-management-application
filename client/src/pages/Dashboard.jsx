import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import {
  HiOutlineUsers, HiOutlineCheckCircle, HiOutlineCurrencyDollar,
  HiOutlineLightningBolt, HiOutlineSparkles, HiOutlineXCircle,
  HiOutlineTrendingUp, HiOutlineStar
} from 'react-icons/hi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const formatCurrency = (val) => {
  if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `$${(val / 1000).toFixed(1)}k`;
  return `$${val.toLocaleString()}`;
};

const statusClass = (s) => {
  const m = { 'New': 'status-new', 'Contacted': 'status-contacted', 'Qualified': 'status-qualified', 'Proposal Sent': 'status-proposal', 'Won': 'status-won', 'Lost': 'status-lost' };
  return m[s] || 'status-new';
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    dashboardAPI.getStats().then(res => setStats(res.data.data)).catch(console.error);
  }, []);

  if (!stats) return <div className="p-20 flex justify-center"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;

  const { summary, pipelineData, sourceData, recentLeads, upcomingFollowUps } = stats;
  const pipelineColors = ['#6366f1', '#8b5cf6', '#06b6d4', '#f59e0b', '#10b981', '#ef4444'];
  const sourceColors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6b7280'];

  const chartStyles = {
    grid: isDarkMode ? '#334155' : '#f3f4f6',
    tooltip: {
      bg: isDarkMode ? '#1e293b' : '#ffffff',
      border: isDarkMode ? '#334155' : '#e5e7eb',
      text: isDarkMode ? '#f8fafc' : '#111827'
    },
    axis: isDarkMode ? '#94a3b8' : '#6b7280'
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of your sales pipeline and performance</p>
        </div>
        <Link to="/leads/new" className="btn-primary">
          <HiOutlineSparkles className="w-4 h-4" /> Add Lead
        </Link>
      </div>

      {/* Main Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Leads', val: summary.totalLeads, icon: HiOutlineUsers, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'New Leads', val: summary.newLeads, icon: HiOutlineSparkles, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Qualified Leads', val: summary.qualifiedLeads, icon: HiOutlineStar, color: 'text-cyan-600', bg: 'bg-cyan-50' },
          { label: 'Won Deals', val: summary.wonLeads, icon: HiOutlineCheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((s, i) => (
          <div key={i} className="card p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${s.bg} ${s.color}`}>
              <s.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{s.label}</p>
              <p className="text-2xl font-bold text-gray-900">{s.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Deal Pipeline Values */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Lost Leads', val: summary.lostLeads, icon: HiOutlineXCircle, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Total Estimated Value', val: formatCurrency(summary.totalEstimatedValue), icon: HiOutlineCurrencyDollar, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Won Deals Value', val: formatCurrency(summary.wonDealsValue), icon: HiOutlineLightningBolt, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Conversion Rate', val: `${summary.conversionRate}%`, icon: HiOutlineTrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((s, i) => (
          <div key={i} className="card p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${s.bg} ${s.color}`}>
              <s.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{s.label}</p>
              <p className="text-2xl font-bold text-gray-900">{s.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline Bar Chart */}
        <div className="lg:col-span-2 card p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-6">Pipeline by Stage</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineData} margin={{ left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartStyles.grid} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: chartStyles.axis }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: chartStyles.axis }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}
                  contentStyle={{ 
                    backgroundColor: chartStyles.tooltip.bg, 
                    borderColor: chartStyles.tooltip.border,
                    color: chartStyles.tooltip.text,
                    borderRadius: '8px', 
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', 
                    fontSize: '13px' 
                  }}
                  itemStyle={{ color: chartStyles.tooltip.text }}
                />
                <Bar dataKey="value" name="Leads" radius={[6, 6, 0, 0]} barSize={44}>
                  {pipelineData.map((entry, i) => <Cell key={i} fill={entry.color || pipelineColors[i % pipelineColors.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Sources Pie Chart */}
        <div className="card p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-6">Lead Sources</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sourceData} cx="50%" cy="45%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="count" nameKey="lead_source">
                  {sourceData.map((entry, i) => <Cell key={i} fill={sourceColors[i % sourceColors.length]} />)}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: chartStyles.tooltip.bg, 
                    borderColor: chartStyles.tooltip.border,
                    color: chartStyles.tooltip.text,
                    borderRadius: '8px', 
                    fontSize: '13px' 
                  }} 
                  itemStyle={{ color: chartStyles.tooltip.text }}
                />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Leads + Upcoming Follow-ups */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-base font-semibold text-gray-900">Recent Leads</h2>
            <Link to="/leads" className="text-sm font-medium text-blue-600 hover:text-blue-700">View All</Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentLeads.map(l => (
              <div key={l.id} className="px-6 py-3.5 flex justify-between items-center hover:bg-gray-50 transition-colors">
                <div className="min-w-0 flex-1 mr-3">
                  <Link to={`/leads/${l.id}`} className="font-semibold text-gray-900 hover:text-blue-600 text-sm truncate block">{l.lead_name}</Link>
                  <p className="text-xs text-gray-500 truncate">{l.company_name} • {formatCurrency(parseFloat(l.estimated_deal_value || 0))}</p>
                </div>
                <span className={`badge shrink-0 ${statusClass(l.status)}`}>{l.status}</span>
              </div>
            ))}
            {!recentLeads.length && <p className="text-sm text-gray-500 text-center py-8">No leads yet.</p>}
          </div>
        </div>

        {/* Upcoming Follow-ups */}
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-base font-semibold text-gray-900">Upcoming Follow-ups</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {upcomingFollowUps && upcomingFollowUps.length > 0 ? upcomingFollowUps.map(l => (
              <div key={l.id} className="px-6 py-3.5 flex justify-between items-center hover:bg-gray-50 transition-colors">
                <div className="min-w-0 flex-1 mr-3">
                  <Link to={`/leads/${l.id}`} className="font-semibold text-gray-900 hover:text-blue-600 text-sm truncate block">{l.lead_name}</Link>
                  <p className="text-xs text-gray-500 truncate">{l.company_name} • {l.assigned_salesperson || 'Unassigned'}</p>
                </div>
                <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full shrink-0">
                  {new Date(l.next_follow_up).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            )) : (
              <p className="text-sm text-gray-500 text-center py-8">No upcoming follow-ups.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
