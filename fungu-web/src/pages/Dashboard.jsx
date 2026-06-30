import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { Users, PlusCircle, LogOut, Wallet, Bell, User, LayoutDashboard } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [chamas, setChamas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
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
    fetchUnreadCount();
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

  const fetchUnreadCount = async () => {
    try {
      const { data } = await api.get('/notifications/unread');
      setUnreadCount(data.count);
    } catch (error) {
      console.error('Failed to fetch unread count');
    }
  };

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data);
    } catch (error) {
      toast.error('Failed to load notifications');
    }
  };

  const handleOpenNotifications = async () => {
    await fetchNotifications();
    setShowNotifications(true);
    await api.put('/notifications/read/all');
    setUnreadCount(0);
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
      <nav className="bg-green-700 text-white px-4 py-3 flex justify-between items-center">
        <h1 className="text-lg font-bold">FunguApp</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenNotifications}
            className="relative hover:text-green-200"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          <button onClick={() => navigate('/profile')} className="hover:text-green-200">
            <User size={20} />
          </button>
          <button
            onClick={() => navigate('/owner')}
            className="hover:text-green-200"
            title="Owner Dashboard"
          >
            <LayoutDashboard size={20} />
          </button>
          <button onClick={handleLogout} className="hover:text-green-200">
            <LogOut size={20} />
          </button>
        </div>
      </nav>
      <div className="bg-green-50 px-4 py-2 text-sm text-green-800 border-b border-green-100">
        Hello, {user?.name}
      </div>

      <div className="max-w-4xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">My Chamas</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowJoin(true)}
              className="flex items-center gap-1 bg-white border border-green-600 text-green-600 px-3 py-2 rounded-lg hover:bg-green-50 transition text-sm"
            >
              <Users size={16} /> Join
            </button>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition text-sm"
            >
              <PlusCircle size={16} /> Create
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

      {showNotifications && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-end p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md mt-16 shadow-xl">
            <div className="flex justify-between items-center p-5 border-b">
              <h3 className="text-lg font-bold">Notifications</h3>
              <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Bell size={32} className="mx-auto mb-3" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                notifications.map(n => (
                  <div key={n._id} className={`p-4 border-b ${n.isRead ? 'bg-white' : 'bg-green-50'}`}>
                    <p className="font-medium text-gray-800 text-sm">{n.title}</p>
                    <p className="text-gray-500 text-xs mt-1">{n.message}</p>
                    <p className="text-gray-300 text-xs mt-2">{new Date(n.createdAt).toLocaleDateString()}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

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