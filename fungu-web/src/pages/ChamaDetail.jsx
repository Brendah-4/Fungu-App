import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { ArrowLeft, Wallet, PlusCircle, HandCoins, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ChamaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [chama, setChama] = useState(null);
  const [contributions, setContributions] = useState([]);
  const [loans, setLoans] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ledger');
  const [showContribute, setShowContribute] = useState(false);
  const [showLoan, setShowLoan] = useState(false);
  const [showPaySub, setShowPaySub] = useState(false);
  const [contributeForm, setContributeForm] = useState({ amount: '', mpesaRef: '', notes: '' });
  const [loanForm, setLoanForm] = useState({ amount: '', reason: '' });
  const [subMpesaRef, setSubMpesaRef] = useState('');

  useEffect(() => {
    fetchAll();
  }, [id]);

  const fetchAll = async () => {
    try {
      const [chamaRes, contribRes, loanRes, subRes] = await Promise.all([
        api.get(`/chamas/${id}`),
        api.get(`/contributions/${id}`),
        api.get(`/loans/${id}`),
        api.get(`/subscriptions/status/${id}`)
      ]);
      setChama(chamaRes.data);
      setContributions(contribRes.data);
      setLoans(loanRes.data);
      setSubscription(subRes.data);
    } catch (error) {
      toast.error('Failed to load chama details');
    } finally {
      setLoading(false);
    }
  };

  const handleContribute = async (e) => {
    e.preventDefault();
    try {
      await api.post('/contributions', {
        chamaId: id,
        amount: Number(contributeForm.amount),
        mpesaRef: contributeForm.mpesaRef,
        notes: contributeForm.notes
      });
      toast.success('Contribution recorded successfully!');
      setShowContribute(false);
      setContributeForm({ amount: '', mpesaRef: '', notes: '' });
      fetchAll();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to record contribution');
    }
  };

  const handleLoanRequest = async (e) => {
    e.preventDefault();
    try {
      await api.post('/loans', {
        chamaId: id,
        amount: Number(loanForm.amount),
        reason: loanForm.reason
      });
      toast.success('Loan request submitted!');
      setShowLoan(false);
      setLoanForm({ amount: '', reason: '' });
      fetchAll();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to request loan');
    }
  };

  const handleVote = async (loanId, vote) => {
    try {
      await api.post(`/loans/${loanId}/vote`, { vote });
      toast.success(`Vote cast: ${vote}`);
      fetchAll();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cast vote');
    }
  };

  const handlePaySubscription = async (e) => {
    e.preventDefault();
    try {
      await api.post('/subscriptions/activate', {
        chamaId: id,
        mpesaRef: subMpesaRef
      });
      toast.success('Subscription activated successfully!');
      setShowPaySub(false);
      setSubMpesaRef('');
      fetchAll();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to activate subscription');
    }
  };

  const handleSendReminders = async () => {
    try {
      const { data } = await api.post(`/contributions/remind/${id}`);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reminders');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!chama) return <div className="min-h-screen flex items-center justify-center">Chama not found</div>;

  const isChairperson = chama.members?.find(
    m => m.user?._id === user?._id && m.role === 'chairperson'
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-green-700 text-white px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate('/dashboard')} className="hover:text-green-200">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold">{chama.name}</h1>
          <p className="text-xs text-green-200">{chama.description}</p>
        </div>
      </nav>

      {subscription && (
        <div className={`px-6 py-3 flex items-center justify-between text-sm ${
          subscription.isActive ? 'bg-green-50 border-b border-green-100' : 'bg-red-50 border-b border-red-100'
        }`}>
          <div className="flex items-center gap-2">
            {subscription.isActive
              ? <CheckCircle size={16} className="text-green-600" />
              : <AlertCircle size={16} className="text-red-600" />
            }
            <span className={subscription.isActive ? 'text-green-700' : 'text-red-700'}>
              {subscription.plan === 'trial'
                ? `Free trial — ${subscription.daysLeft} days left`
                : subscription.isActive
                  ? `Basic plan — ${subscription.daysLeft} days left`
                  : 'Subscription expired — renew to continue'
              }
            </span>
          </div>
          {isChairperson && (
            <button
              onClick={() => setShowPaySub(true)}
              className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-green-700"
            >
              {subscription.isActive ? 'Renew — KES 300/mo' : 'Pay Now — KES 300'}
            </button>
          )}
        </div>
      )}

      <div className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow text-center">
            <p className="text-sm text-gray-500">Balance</p>
            <p className="text-2xl font-bold text-green-600">KES {chama.balance?.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow text-center">
            <p className="text-sm text-gray-500">Members</p>
            <p className="text-2xl font-bold text-gray-800">{chama.members?.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow text-center">
            <p className="text-sm text-gray-500">Monthly</p>
            <p className="text-2xl font-bold text-gray-800">KES {chama.rules?.contributionAmount?.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex gap-3 mb-6 flex-wrap">
          <button
            onClick={() => setShowContribute(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            <PlusCircle size={18} /> Record Contribution
          </button>
          <button
            onClick={() => setShowLoan(true)}
            className="flex items-center gap-2 bg-white border border-green-600 text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition"
          >
            <HandCoins size={18} /> Request Loan
          </button>
          {isChairperson && (
            <button
              onClick={handleSendReminders}
              className="flex items-center gap-2 bg-white border border-blue-500 text-blue-500 px-4 py-2 rounded-lg hover:bg-blue-50 transition"
            >
              Send Reminders
            </button>
          )}
        </div>

        <div className="flex gap-2 mb-4">
          {['ledger', 'loans', 'members'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${
                activeTab === tab
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'ledger' && (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            {contributions.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Wallet size={40} className="mx-auto mb-3" />
                <p>No contributions yet</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3 text-left">Member</th>
                    <th className="px-4 py-3 text-left">Amount</th>
                    <th className="px-4 py-3 text-left">M-Pesa Ref</th>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {contributions.map(c => (
                    <tr key={c._id}>
                      <td className="px-4 py-3 font-medium">{c.member?.name}</td>
                      <td className="px-4 py-3 text-green-600 font-semibold">KES {c.amount?.toLocaleString()}</td>
                      <td className="px-4 py-3 text-gray-500">{c.mpesaRef || '-'}</td>
                      <td className="px-4 py-3 text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">{c.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'loans' && (
          <div className="space-y-4">
            {loans.length === 0 ? (
              <div className="text-center py-12 text-gray-400 bg-white rounded-xl shadow">
                <HandCoins size={40} className="mx-auto mb-3" />
                <p>No loan requests yet</p>
              </div>
            ) : (
              loans.map(loan => (
                <div key={loan._id} className="bg-white rounded-xl shadow p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-gray-800">{loan.member?.name}</p>
                      <p className="text-sm text-gray-500 mt-1">{loan.reason}</p>
                      <p className="text-green-600 font-semibold mt-2">KES {loan.amount?.toLocaleString()}</p>
                      <p className="text-xs text-gray-400">Total repayable: KES {loan.totalRepayable?.toLocaleString()}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      loan.status === 'approved' ? 'bg-green-100 text-green-700' :
                      loan.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {loan.status}
                    </span>
                  </div>
                  {loan.status === 'pending' && loan.member?._id !== user?._id && (
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => handleVote(loan._id, 'approve')}
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleVote(loan._id, 'reject')}
                        className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mt-2">{loan.votes?.length} vote(s) cast</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'members' && (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Phone</th>
                  <th className="px-4 py-3 text-left">Role</th>
                  <th className="px-4 py-3 text-left">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {chama.members?.map(m => (
                  <tr key={m._id}>
                    <td className="px-4 py-3 font-medium">{m.user?.name}</td>
                    <td className="px-4 py-3 text-gray-500">{m.user?.phone}</td>
                    <td className="px-4 py-3 capitalize">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">{m.role}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{new Date(m.joinedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showContribute && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Record Contribution</h3>
            <form onSubmit={handleContribute} className="space-y-3">
              <input
                type="number"
                placeholder="Amount (KES)"
                value={contributeForm.amount}
                onChange={e => setContributeForm({ ...contributeForm, amount: e.target.value })}
                required
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                placeholder="M-Pesa reference (optional)"
                value={contributeForm.mpesaRef}
                onChange={e => setContributeForm({ ...contributeForm, mpesaRef: e.target.value })}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                placeholder="Notes (optional)"
                value={contributeForm.notes}
                onChange={e => setContributeForm({ ...contributeForm, notes: e.target.value })}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <div className="flex gap-3 mt-4">
                <button type="button" onClick={() => setShowContribute(false)} className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showLoan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Request a Loan</h3>
            <form onSubmit={handleLoanRequest} className="space-y-3">
              <input
                type="number"
                placeholder="Amount (KES)"
                value={loanForm.amount}
                onChange={e => setLoanForm({ ...loanForm, amount: e.target.value })}
                required
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <textarea
                placeholder="Reason for loan"
                value={loanForm.reason}
                onChange={e => setLoanForm({ ...loanForm, reason: e.target.value })}
                required
                rows={3}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <div className="flex gap-3 mt-4">
                <button type="button" onClick={() => setShowLoan(false)} className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPaySub && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-2">Activate Subscription</h3>
            <p className="text-gray-500 text-sm mb-4">
              Send KES 300 to M-Pesa till number <span className="font-bold text-green-700">XXXXXXX</span> then enter the confirmation code below.
            </p>
            <form onSubmit={handlePaySubscription} className="space-y-3">
              <input
                type="text"
                placeholder="M-Pesa confirmation code e.g. RGH7Y8K9J"
                value={subMpesaRef}
                onChange={e => setSubMpesaRef(e.target.value)}
                required
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <div className="flex gap-3 mt-4">
                <button type="button" onClick={() => setShowPaySub(false)} className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">Activate — KES 300/mo</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChamaDetail;