import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { leadAPI, authAPI } from '../services/api';
import toast from 'react-hot-toast';
import { HiOutlineArrowLeft, HiOutlineSave } from 'react-icons/hi';

const STATUSES = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];
const SOURCES = ['Website', 'LinkedIn', 'Referral', 'Cold Email', 'Event', 'Advertisement', 'Other'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

const LeadForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [salespersons, setSalespersons] = useState([]);
  const [form, setForm] = useState({
    lead_name: '', company_name: '', email: '', phone: '',
    lead_source: 'Website', assigned_salesperson: '', status: 'New',
    estimated_deal_value: '', priority: 'Medium', lead_score: 50,
    next_follow_up: '', description: ''
  });

  useEffect(() => {
    fetchSalespersons();
    if (isEdit) {
      fetchLead();
    }
  }, [id]);

  const fetchSalespersons = async () => {
    try {
      const res = await authAPI.getUsers();
      setSalespersons(res.data.data || []);
    } catch (err) {
      console.error('Failed to load salespersons');
    }
  };

  const fetchLead = async () => {
    try {
      const res = await leadAPI.getById(id);
      const l = res.data.data;
      setForm({
        lead_name: l.lead_name || '',
        company_name: l.company_name || '',
        email: l.email || '',
        phone: l.phone || '',
        lead_source: l.lead_source || 'Website',
        assigned_salesperson: l.assigned_salesperson || '',
        status: l.status || 'New',
        estimated_deal_value: l.estimated_deal_value || '',
        priority: l.priority || 'Medium',
        lead_score: l.lead_score || 0,
        next_follow_up: l.next_follow_up || '',
        description: l.description || ''
      });
    } catch (err) {
      toast.error('Failed to load lead details');
      navigate('/leads');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.lead_name || !form.company_name || !form.email) {
      return toast.error('Required fields are missing');
    }
    setLoading(true);
    try {
      const data = {
        ...form,
        estimated_deal_value: parseFloat(form.estimated_deal_value) || 0,
        lead_score: parseInt(form.lead_score) || 0,
        next_follow_up: form.next_follow_up || null
      };
      if (isEdit) {
        await leadAPI.update(id, data);
        toast.success('Lead updated successfully');
        navigate(`/leads/${id}`);
      } else {
        const res = await leadAPI.create(data);
        toast.success('Lead created successfully');
        navigate(`/leads/${res.data.data.id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="flex justify-center items-center h-64">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const Field = ({ label, required, children }) => (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-12">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-md text-gray-500 hover:bg-gray-200 transition-colors">
          <HiOutlineArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Lead' : 'Create New Lead'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Lead Name" required>
              <input type="text" name="lead_name" value={form.lead_name} onChange={handleChange} className="input-field" placeholder="John Doe" />
            </Field>
            <Field label="Company Name" required>
              <input type="text" name="company_name" value={form.company_name} onChange={handleChange} className="input-field" placeholder="Acme Corp" />
            </Field>
            <Field label="Email Address" required>
              <input type="email" name="email" value={form.email} onChange={handleChange} className="input-field" placeholder="john@example.com" />
            </Field>
            <Field label="Phone Number">
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="input-field" placeholder="+1 (555) 000-0000" />
            </Field>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">Pipeline Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Lead Source">
              <select name="lead_source" value={form.lead_source} onChange={handleChange} className="input-field">
                {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Assigned Salesperson">
              <select name="assigned_salesperson" value={form.assigned_salesperson} onChange={handleChange} className="input-field">
                <option value="">Select Salesperson</option>
                {salespersons.map(u => <option key={u.id} value={u.name}>{u.name} ({u.role})</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select name="status" value={form.status} onChange={handleChange} className="input-field">
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Priority">
              <select name="priority" value={form.priority} onChange={handleChange} className="input-field">
                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </Field>
            <Field label="Deal Value ($)">
              <input type="number" name="estimated_deal_value" value={form.estimated_deal_value} onChange={handleChange} className="input-field" placeholder="5000" min="0" step="100" />
            </Field>
            <Field label="Follow-up Date">
              <input type="date" name="next_follow_up" value={form.next_follow_up} onChange={handleChange} className="input-field" />
            </Field>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">Additional Information</h2>
          <div className="space-y-5">
            <Field label={`Lead Score: ${form.lead_score}`}>
              <input type="range" name="lead_score" value={form.lead_score} onChange={handleChange} min="0" max="100" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
            </Field>
            <Field label="Description / Notes">
              <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="w-full p-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" placeholder="Add any background info here..."></textarea>
            </Field>
          </div>
        </div>

        <div className="flex items-center gap-3 justify-end">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <HiOutlineSave className="w-4 h-4" />}
            Save Lead
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeadForm;
