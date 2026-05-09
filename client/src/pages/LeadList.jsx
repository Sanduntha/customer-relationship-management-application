import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { leadAPI, authAPI } from '../services/api';
import toast from 'react-hot-toast';
import { HiOutlineSearch, HiOutlinePlus, HiOutlineFilter, HiOutlineDownload, HiOutlineEye, HiOutlinePencil, HiOutlineTrash, HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlineViewGrid, HiOutlineViewList } from 'react-icons/hi';
import KanbanView from '../components/KanbanView';

const STATUSES = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];
const SOURCES = ['Website', 'LinkedIn', 'Referral', 'Cold Email', 'Event', 'Advertisement', 'Other'];

const statusClass = (s) => {
  const map = { 'New': 'status-new', 'Contacted': 'status-contacted', 'Qualified': 'status-qualified', 'Proposal Sent': 'status-proposal', 'Won': 'status-won', 'Lost': 'status-lost' };
  return map[s] || 'status-new';
};

const LeadList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [leads, setLeads] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || '',
    lead_source: searchParams.get('lead_source') || '',
    assigned_salesperson: searchParams.get('assigned_salesperson') || ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selected, setSelected] = useState([]);
  const [bulkStatus, setBulkStatus] = useState('');
  const [salespersons, setSalespersons] = useState([]);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'kanban'

  useEffect(() => {
    authAPI.getUsers().then(res => setSalespersons(res.data.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [searchParams]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(searchParams.entries());
      const res = await leadAPI.getAll(params);
      setLeads(res.data.data.leads);
      setPagination(res.data.data.pagination);
    } catch (err) {
      toast.error('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    const params = {};
    if (search) params.search = search;
    if (filters.status) params.status = filters.status;
    if (filters.lead_source) params.lead_source = filters.lead_source;
    if (filters.assigned_salesperson) params.assigned_salesperson = filters.assigned_salesperson;
    params.page = '1';
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearch('');
    setFilters({ status: '', lead_source: '', assigned_salesperson: '' });
    setSearchParams({});
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this lead?')) return;
    try {
      await leadAPI.delete(id);
      toast.success('Lead deleted');
      fetchLeads();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const handleBulkUpdate = async () => {
    if (!bulkStatus || selected.length === 0) return;
    try {
      await leadAPI.bulkUpdateStatus({ lead_ids: selected, status: bulkStatus });
      toast.success(`${selected.length} leads updated`);
      setSelected([]);
      setBulkStatus('');
      fetchLeads();
    } catch (err) {
      toast.error('Bulk update failed');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await leadAPI.update(id, { status });
      toast.success('Status updated');
      fetchLeads();
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const handleExport = async () => {
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      const res = await leadAPI.exportCSV(params);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'leads_export.csv';
      a.click();
    } catch (err) {
      toast.error('Export failed');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track your pipeline</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-gray-200 rounded-lg p-1 mr-2">
            <button 
                onClick={() => setViewMode('table')} 
                className={`p-1.5 rounded-md transition-all ${viewMode === 'table' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                title="Table View"
            >
                <HiOutlineViewList className="w-5 h-5" />
            </button>
            <button 
                onClick={() => setViewMode('kanban')} 
                className={`p-1.5 rounded-md transition-all ${viewMode === 'kanban' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                title="Pipeline View"
            >
                <HiOutlineViewGrid className="w-5 h-5" />
            </button>
          </div>
          <button onClick={handleExport} className="btn-secondary">
            <HiOutlineDownload className="w-4 h-4" /> Export
          </button>
          <Link to="/leads/new" className="btn-primary">
            <HiOutlinePlus className="w-4 h-4" /> New Lead
          </Link>
        </div>
      </div>

      <div className="card p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
              placeholder="Search leads, companies..."
              className="input-field pl-10"
            />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className="btn-secondary">
            <HiOutlineFilter className="w-4 h-4" /> Filters
          </button>
          <button onClick={applyFilters} className="btn-primary">Search</button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
              <select value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })} className="input-field">
                <option value="">All Statuses</option>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Source</label>
              <select value={filters.lead_source} onChange={e => setFilters({ ...filters, lead_source: e.target.value })} className="input-field">
                <option value="">All Sources</option>
                {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Salesperson</label>
              <div className="flex gap-2">
                <select value={filters.assigned_salesperson} onChange={e => setFilters({ ...filters, assigned_salesperson: e.target.value })} className="input-field flex-1">
                  <option value="">All Salespersons</option>
                  {salespersons.map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
                </select>
                <button onClick={clearFilters} className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors">Clear</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {selected.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm font-medium text-blue-800">{selected.length} items selected</span>
          <div className="flex items-center gap-3">
            <select value={bulkStatus} onChange={e => setBulkStatus(e.target.value)} className="input-field py-1 h-9 min-w-[150px]">
              <option value="">Change Status...</option>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button onClick={handleBulkUpdate} className="btn-primary py-1.5 h-9" disabled={!bulkStatus}>Apply</button>
            <button onClick={() => setSelected([])} className="text-sm text-gray-500 hover:text-gray-700">Cancel</button>
          </div>
        </div>
      )}

      <div className={viewMode === 'table' ? 'card overflow-hidden' : ''}>
        {loading ? (
          <div className="p-12 flex justify-center"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
        ) : leads.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No leads found.</div>
        ) : viewMode === 'table' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                <tr>
                  <th className="p-4 w-12"><input type="checkbox" checked={selected.length === leads.length} onChange={() => setSelected(selected.length === leads.length ? [] : leads.map(l => l.id))} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" /></th>
                  <th className="p-4">Name / Company</th>
                  <th className="p-4 hidden md:table-cell">Source</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 hidden sm:table-cell">Value</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leads.map(lead => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4"><input type="checkbox" checked={selected.includes(lead.id)} onChange={() => setSelected(selected.includes(lead.id) ? selected.filter(id => id !== lead.id) : [...selected, lead.id])} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" /></td>
                    <td className="p-4">
                      <Link to={`/leads/${lead.id}`} className="block">
                        <p className="font-semibold text-gray-900 hover:text-blue-600">{lead.lead_name}</p>
                        <p className="text-xs text-gray-500">{lead.company_name}</p>
                      </Link>
                    </td>
                    <td className="p-4 hidden md:table-cell text-gray-500">{lead.lead_source}</td>
                    <td className="p-4">
                      <span className={`badge ${statusClass(lead.status)}`}>{lead.status}</span>
                    </td>
                    <td className="p-4 hidden sm:table-cell font-medium text-gray-900">${parseFloat(lead.estimated_deal_value).toLocaleString()}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 text-gray-400">
                        <Link to={`/leads/${lead.id}`} className="p-1 hover:text-blue-600"><HiOutlineEye className="w-5 h-5" /></Link>
                        <Link to={`/leads/${lead.id}/edit`} className="p-1 hover:text-gray-900"><HiOutlinePencil className="w-5 h-5" /></Link>
                        <button onClick={() => handleDelete(lead.id)} className="p-1 hover:text-red-600"><HiOutlineTrash className="w-5 h-5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <KanbanView leads={leads} onStatusChange={handleStatusChange} />
        )}

        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-sm text-gray-600">
            <span>Page {pagination.page} of {pagination.totalPages}</span>
            <div className="flex gap-2">
              <button onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), page: pagination.page - 1 })} disabled={pagination.page <= 1} className="p-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50"><HiOutlineChevronLeft className="w-4 h-4" /></button>
              <button onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), page: pagination.page + 1 })} disabled={pagination.page >= pagination.totalPages} className="p-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50"><HiOutlineChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadList;
