import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { Users, Wallet, TrendingUp, ArrowLeft, Building2 } from 'lucide-react';

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/owner/stats');
      setStats(data);
    } catch (error) {
      toast.error('Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-green-700 text-white px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate('/dashboard')} className="hover:text-green-200">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold">Owner Dashboard</h1>
          <p className="text-xs text-green-200">FunguApp Platform Overview</p>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Platform Revenue</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow text-center">
            <Building2 size={28} className="mx-auto text-green-600 mb-2" />
            <p className="text-3xl font-bold text-gray-800">{stats?.totalChamas}</p>
            <p className="text-sm text-gray-500 mt-1">Total Chamas</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow text-center">
            <Users size={28} className="mx-auto text-blue-500 mb-2" />
            <p className="text-3xl font-bold text-gray-800">{stats?.totalUsers}</p>
            <p className="text-sm text-gray-500 mt-1">Total Users</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow text-center">
            <Wallet size={28} className="mx-auto text-purple-500 mb-2" />
            <p className="text-3xl font-bold text-gray-800">KES {stats?.totalMoneyManaged?.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">Money Managed</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow text-center">
            <TrendingUp size={28} className="mx-auto text-orange-500 mb-2" />
            <p className="text-3xl font-bold text-green-600">KES {stats?.totalRevenue?.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">Your Revenue</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow">
            <p className="text-sm text-gray-500">Subscription Revenue</p>
            <p className="text-2xl font-bold text-green-600 mt-1">KES {stats?.subscriptionRevenue?.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-1">KES 300 × {stats?.totalChamas} chamas</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow">
            <p className="text-sm text-gray-500">Loan Fee Revenue</p>
            <p className="text-2xl font-bold text-green-600 mt-1">KES {stats?.totalLoanFees?.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-1">0.5% of all loans disbursed</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow">
            <p className="text-sm text-gray-500">Total Contributions</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{stats?.totalContributions}</p>
            <p className="text-xs text-gray-400 mt-1">Confirmed transactions</p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-4">All Chamas on Platform</h2>
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">Chama Name</th>
                <th className="px-4 py-3 text-left">Created By</th>
                <th className="px-4 py-3 text-left">Members</th>
                <th className="px-4 py-3 text-left">Balance</th>
                <th className="px-4 py-3 text-left">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stats?.recentChamas?.map(chama => (
                <tr key={chama._id}>
                  <td className="px-4 py-3 font-medium">{chama.name}</td>
                  <td className="px-4 py-3 text-gray-500">{chama.createdBy?.name}</td>
                  <td className="px-4 py-3">{chama.members?.length}</td>
                  <td className="px-4 py-3 text-green-600 font-semibold">KES {chama.balance?.toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-500">{new Date(chama.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;