import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { Users, PlusCircle, LogOut, Wallet } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [chamas, setChamas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [form, setForm] = useState({
    name: '',
    description: '',
    contributionAmount: '',
    contributionFrequency: 'monthly',
    penaltyAmount: ''
  });

  useEffect(() => {
    fetchChamas();
  }, []);

  const fetchChamas = async () => {
    try {
      const { data } = await api.get('/chamas/my');
      setChamas(data);
    } catch (error) {
      toast.error('Failed to load chamas');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/chamas/create', {
        name: form.name,
        description: form.description,
        rules: {
          contributionAmount: Number(form.contributionAmount),
          contributionFrequency: form.contributionFrequency,
          penaltyAmount: Number(form.penaltyAmount)
        }
      });
      toast.success('Chama created successfully!');
      setShowCreate(false);
      fetchChamas();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create chama');
    }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    try {
      await api.post('/chamas/join', { inviteCode });
      toast.success('Joined chama successfully!');
      setShowJoin(false);
      fetchChamas();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to join chama');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-green-700 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">FunguApp</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm">Hello, {user?.name}</span>
          <button onClick={handleLogout} className="flex items-center gap-1 text-sm hover:text-green-200">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">My Chamas</h2>
          <div className="flex gap-3">
            <button
              onClick={() => setShowJoin(true)}
              className="flex items-center gap-2 bg-white border border-green-600 text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition"
            >
              <Users size={18} /> Join Chama
            </button>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              <PlusCircle size={18} /> Create Chama
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : chamas.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Wallet size={48} className="mx-auto mb-4" />
            <p className="text-lg">You are not in any chama yet</p>
            <p className="text-sm">Create one or join with an invite code</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chamas.map((chama) => (
              <div
                key={chama._id}
                onClick={() => navigate(`/chama/${chama._id}`)}
                className="bg-white rounded-xl shadow p-5 cursor-pointer hover:shadow-md transition border border-gray-100"
              >
                <h3 className="text-lg font-bold text-gray-800">{chama.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{chama.description}</p>
                <div className="mt-4 flex justify-between text-sm">
                  <span className="text-green-600 font-semibold">
                    KES {chama.balance?.toLocaleString()}
                  </span>
                  <span className="text-gray-400">{chama.members?.length} members</span>
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  Invite code: <span className="font-mono font-bold">{chama.inviteCode}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Create a Chama</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <input
                type="text"
                placeholder="Chama name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                placeholder="Description"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="number"
                placeholder="Contribution amount (KES)"
                value={form.contributionAmount}
                onChange={e => setForm({ ...form, contributionAmount: e.target.value })}
                required
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <select
                value={form.contributionFrequency}
                onChange={e => setForm({ ...form, contributionFrequency: e.target.value })}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
              <input
                type="number"
                placeholder="Penalty amount (KES)"
                value={form.penaltyAmount}
                onChange={e => setForm({ ...form, penaltyAmount: e.target.value })}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showJoin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Join a Chama</h3>
            <form onSubmit={handleJoin} className="space-y-3">
              <input
                type="text"
                placeholder="Enter invite code"
                value={inviteCode}
                onChange={e => setInviteCode(e.target.value)}
                required
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowJoin(false)}
                  className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                >
                  Join
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;