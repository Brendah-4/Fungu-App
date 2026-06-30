import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { ArrowLeft, Trash2, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ChamaSettings = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [chama, setChama] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    contributionAmount: '',
    contributionFrequency: 'monthly',
    penaltyAmount: ''
  });

  useEffect(() => {
    fetchChama();
  }, [id]);

  const fetchChama = async () => {
    try {
      const { data } = await api.get(`/chamas/${id}`);
      setChama(data);
      setForm({
        name: data.name,
        description: data.description || '',
        contributionAmount: data.rules.contributionAmount,
        contributionFrequency: data.rules.contributionFrequency,
        penaltyAmount: data.rules.penaltyAmount
      });
    } catch (error) {
      toast.error('Failed to load chama');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/chamas/${id}`, {
        name: form.name,
        description: form.description,
        rules: {
          contributionAmount: Number(form.contributionAmount),
          contributionFrequency: form.contributionFrequency,
          penaltyAmount: Number(form.penaltyAmount)
        }
      });
      toast.success('Chama settings updated!');
      fetchChama();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveMember = async (memberId, memberName) => {
    if (!window.confirm(`Remove ${memberName} from this chama?`)) return;
    try {
      await api.delete(`/chamas/${id}/members/${memberId}`);
      toast.success('Member removed');
      fetchChama();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove member');
    }
  };

  const handleChangeRole = async (memberId, newRole) => {
    try {
      await api.put(`/chamas/${id}/members/${memberId}/role`, { role: newRole });
      toast.success('Role updated');
      fetchChama();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update role');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!chama) return <div className="min-h-screen flex items-center justify-center">Chama not found</div>;

  const isChairperson = chama.members?.find(
    m => m.user?._id === user?._id && m.role === 'chairperson'
  );

  if (!isChairperson) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Only the chairperson can access settings
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-green-700 text-white px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate(`/chama/${id}`)} className="hover:text-green-200">
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-2">
          <Settings size={18} />
          <h1 className="text-xl font-bold">{chama.name} Settings</h1>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-bold mb-4">Chama Details</h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chama Name</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contribution Amount (KES)</label>
              <input
                type="number"
                value={form.contributionAmount}
                onChange={e => setForm({ ...form, contributionAmount: e.target.value })}
                required
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
              <select
                value={form.contributionFrequency}
                onChange={e => setForm({ ...form, contributionFrequency: e.target.value })}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Penalty Amount (KES)</label>
              <input
                type="number"
                value={form.penaltyAmount}
                onChange={e => setForm({ ...form, penaltyAmount: e.target.value })}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-bold mb-4">Manage Members</h3>
          <div className="space-y-3">
            {chama.members?.map(m => (
              <div key={m._id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{m.user?.name}</p>
                  <p className="text-xs text-gray-500">{m.user?.phone}</p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={m.role}
                    onChange={e => handleChangeRole(m.user._id, e.target.value)}
                    disabled={m.user._id === user?._id}
                    className="text-sm border rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    <option value="member">Member</option>
                    <option value="treasurer">Treasurer</option>
                    <option value="secretary">Secretary</option>
                    <option value="chairperson">Chairperson</option>
                  </select>
                  {m.user._id !== user?._id && (
                    <button
                      onClick={() => handleRemoveMember(m.user._id, m.user.name)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChamaSettings;