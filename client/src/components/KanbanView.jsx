import { Link } from 'react-router-dom';
import { HiOutlineDotsVertical, HiOutlineCurrencyDollar } from 'react-icons/hi';

const STATUSES = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];

const KanbanView = ({ leads, onStatusChange }) => {
  const groupedLeads = STATUSES.reduce((acc, status) => {
    acc[status] = leads.filter(l => l.status === status);
    return acc;
  }, {});

  const getStatusColor = (s) => {
    const map = { 'New': 'bg-blue-500', 'Contacted': 'bg-indigo-500', 'Qualified': 'bg-cyan-500', 'Proposal Sent': 'bg-amber-500', 'Won': 'bg-emerald-500', 'Lost': 'bg-red-500' };
    return map[s] || 'bg-gray-500';
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar min-h-[600px]">
      {STATUSES.map(status => (
        <div key={status} className="flex-shrink-0 w-80 bg-gray-100/50 dark:bg-slate-800/40 rounded-xl flex flex-col border border-gray-200 dark:border-slate-700">
          <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-t-xl">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${getStatusColor(status)}`}></span>
              <h3 className="font-semibold text-gray-900 dark:text-slate-100 text-sm">{status}</h3>
              <span className="text-xs font-medium text-gray-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">{groupedLeads[status].length}</span>
            </div>
            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-300"><HiOutlineDotsVertical className="w-4 h-4" /></button>
          </div>

          <div className="p-3 space-y-3 flex-1 overflow-y-auto">
            {groupedLeads[status].map(lead => (
              <div key={lead.id} className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow cursor-default group">
                <div className="flex justify-between items-start mb-2">
                  <Link to={`/leads/${lead.id}`} className="font-bold text-gray-900 dark:text-slate-100 hover:text-blue-600 transition-colors line-clamp-1">{lead.lead_name}</Link>
                </div>
                <p className="text-xs text-gray-500 dark:text-slate-400 mb-3 truncate">{lead.company_name}</p>
                
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50 dark:border-slate-700">
                  <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                    <HiOutlineCurrencyDollar className="w-3.5 h-3.5" />
                    <span>{parseFloat(lead.estimated_deal_value).toLocaleString()}</span>
                  </div>
                  <div className="flex -space-x-2">
                     <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 border-2 border-white dark:border-slate-800 flex items-center justify-center text-[10px] font-bold text-blue-600 dark:text-blue-300" title={`Assigned to ${lead.assigned_salesperson}`}>
                        {lead.assigned_salesperson?.charAt(0) || '?'}
                     </div>
                  </div>
                </div>

                <div className="mt-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <select 
                        value={lead.status} 
                        onChange={(e) => onStatusChange(lead.id, e.target.value)}
                        className="text-[10px] font-medium bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded px-1.5 py-0.5 focus:outline-none focus:border-blue-500 text-gray-900 dark:text-slate-100"
                    >
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
              </div>
            ))}
            {groupedLeads[status].length === 0 && (
              <div className="h-24 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-lg flex items-center justify-center text-xs text-gray-400 dark:text-slate-500">
                No leads here
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanView;
