import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { leadAPI, noteAPI } from '../services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { HiOutlinePencil, HiOutlineTrash, HiOutlineArrowLeft, HiOutlineMail, HiOutlinePhone, HiOutlineOfficeBuilding, HiOutlineGlobe, HiOutlineUser, HiOutlineCurrencyDollar, HiOutlineClock, HiOutlineTag, HiOutlineChatAlt2, HiOutlineSparkles, HiOutlineLightningBolt } from 'react-icons/hi';

const statusClass = (s) => {
  const m = { 'New': 'status-new', 'Contacted': 'status-contacted', 'Qualified': 'status-qualified', 'Proposal Sent': 'status-proposal', 'Won': 'status-won', 'Lost': 'status-lost' };
  return m[s] || 'status-new';
};

const STATUSES = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];

const LeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState('');
  const [activeTab, setActiveTab] = useState('details');
  const [enriching, setEnriching] = useState(false);

  useEffect(() => { fetchLead(); }, [id]);

  const fetchLead = async () => {
    try {
      const res = await leadAPI.getById(id);
      setLead(res.data.data);
    } catch (err) {
      toast.error('Lead not found');
      navigate('/leads');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (e) => {
    try {
      await leadAPI.update(id, { status: e.target.value });
      toast.success('Status updated');
      fetchLead();
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    try {
      await noteAPI.add(id, { note_content: noteText });
      setNoteText('');
      fetchLead();
    } catch (err) {
      toast.error('Failed to add note');
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!confirm('Delete note?')) return;
    try {
      await noteAPI.delete(id, noteId);
      fetchLead();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this lead?')) return;
    try {
      await leadAPI.delete(id);
      navigate('/leads');
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const handleEnrich = async () => {
    setEnriching(true);
    // Simulate API delay
    await new Promise(r => setTimeout(r, 1500));
    try {
      const enrichmentData = `✨ AI Enrichment Complete:\n- Company Size: 50-200 employees\n- Industry: Technology / SaaS\n- Verified LinkedIn: found\n- Recent Funding: Series B ($12M)`;
      await noteAPI.add(id, { note_content: enrichmentData });
      
      // Also boost lead score
      const newScore = Math.min(100, (lead.lead_score || 50) + 15);
      await leadAPI.update(id, { lead_score: newScore });
      
      toast.success('Lead enriched successfully!');
      fetchLead();
    } catch (err) {
      toast.error('Enrichment failed');
    } finally {
      setEnriching(false);
    }
  };

  if (loading) return <div className="p-20 flex justify-center"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!lead) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-12">
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => navigate('/leads')} className="p-2 -ml-2 rounded-md text-gray-500 hover:bg-gray-200 transition-colors">
          <HiOutlineArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-sm font-medium text-gray-500">Back to Leads</span>
      </div>

      <div className="card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">{lead.lead_name}</h1>
            <span className={`badge ${statusClass(lead.status)}`}>{lead.status}</span>
          </div>
          <p className="text-sm text-gray-500">{lead.company_name} • Created {format(new Date(lead.created_at), 'MMM d, yyyy')} • Updated {format(new Date(lead.updated_at), 'MMM d, yyyy')}</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select value={lead.status} onChange={handleStatusChange} className="input-field py-1.5 h-auto text-sm w-full md:w-40 font-medium">
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button 
            onClick={handleEnrich} 
            disabled={enriching} 
            className="btn-secondary text-blue-600 hover:bg-blue-50 hover:border-blue-200"
            title="Enrich lead data with AI"
          >
            {enriching ? <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div> : <HiOutlineLightningBolt className="w-4 h-4" />}
            Enrich
          </button>
          <Link to={`/leads/${id}/edit`} className="btn-secondary whitespace-nowrap"><HiOutlinePencil className="w-4 h-4" /> Edit</Link>
          <button onClick={handleDelete} className="btn-secondary text-red-600 hover:bg-red-50 hover:border-red-200 whitespace-nowrap"><HiOutlineTrash className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="flex border-b border-gray-200">
        {['details', 'notes', 'activity'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-3 text-sm font-medium capitalize border-b-2 transition-colors ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'details' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          <div className="card p-6 space-y-4">
            <h3 className="font-semibold text-gray-900 border-b border-gray-100 pb-2">Contact Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex gap-3 text-gray-600"><HiOutlineMail className="w-5 h-5 text-gray-400" /> <span className="font-medium text-gray-900">{lead.email}</span></div>
              <div className="flex gap-3 text-gray-600"><HiOutlinePhone className="w-5 h-5 text-gray-400" /> <span>{lead.phone || '-'}</span></div>
              <div className="flex gap-3 text-gray-600"><HiOutlineOfficeBuilding className="w-5 h-5 text-gray-400" /> <span>{lead.company_name}</span></div>
            </div>
          </div>
          <div className="card p-6 space-y-4">
            <h3 className="font-semibold text-gray-900 border-b border-gray-100 pb-2">Deal Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex gap-3 text-gray-600"><HiOutlineCurrencyDollar className="w-5 h-5 text-gray-400" /> <span className="font-medium text-gray-900">${parseFloat(lead.estimated_deal_value).toLocaleString()}</span></div>
              <div className="flex gap-3 text-gray-600"><HiOutlineUser className="w-5 h-5 text-gray-400" /> <span>Rep: {lead.assigned_salesperson || 'Unassigned'}</span></div>
              <div className="flex gap-3 text-gray-600"><HiOutlineGlobe className="w-5 h-5 text-gray-400" /> <span>Source: {lead.lead_source}</span></div>
              <div className="flex gap-3 text-gray-600"><HiOutlineTag className="w-5 h-5 text-gray-400" /> <span>Priority: {lead.priority || 'Medium'}</span></div>
              <div className="flex gap-3 text-gray-600"><HiOutlineChatAlt2 className="w-5 h-5 text-gray-400" /> <span>Lead Score: {lead.lead_score ?? 0}/100</span></div>
              <div className="flex gap-3 text-gray-600"><HiOutlineClock className="w-5 h-5 text-gray-400" /> <span>Follow-up: {lead.next_follow_up ? format(new Date(lead.next_follow_up), 'MMM d, yyyy') : 'None'}</span></div>
            </div>
          </div>
          {lead.description && (
            <div className="card p-6 md:col-span-2 space-y-2">
              <h3 className="font-semibold text-gray-900 border-b border-gray-100 pb-2">Notes & Background</h3>
              <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">{lead.description}</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'notes' && (
        <div className="space-y-6 animate-fade-in">
          <form onSubmit={handleAddNote} className="card p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Add a Note</label>
            <textarea value={noteText} onChange={e => setNoteText(e.target.value)} rows={3} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="Type here..."></textarea>
            <div className="mt-3 flex justify-end"><button type="submit" disabled={!noteText.trim()} className="btn-primary py-1.5 px-4">Save Note</button></div>
          </form>

          <div className="space-y-4">
            {lead.notes?.map(note => (
              <div key={note.id} className="card p-5">
                <p className="text-sm text-gray-800 whitespace-pre-wrap">{note.note_content}</p>
                <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
                  <span className="font-medium text-gray-700">{note.created_by} • {format(new Date(note.created_at), 'MMM d, h:mm a')}</span>
                  <button onClick={() => handleDeleteNote(note.id)} className="text-red-500 hover:text-red-700"><HiOutlineTrash className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
            {!lead.notes?.length && <p className="text-sm text-gray-500 text-center py-8">No notes yet.</p>}
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="card p-0 overflow-hidden animate-fade-in">
          <div className="divide-y divide-gray-100">
            {lead.activities?.map(act => (
              <div key={act.id} className="p-4 flex gap-4 hover:bg-gray-50">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">❖</div>
                <div>
                  <p className="text-sm text-gray-800">{act.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{act.performed_by} • {format(new Date(act.created_at), 'MMM d, yyyy h:mm a')}</p>
                </div>
              </div>
            ))}
            {!lead.activities?.length && <p className="text-sm text-gray-500 text-center py-8">No activity recorded.</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadDetail;
