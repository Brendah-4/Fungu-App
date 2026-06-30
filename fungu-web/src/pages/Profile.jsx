import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { ArrowLeft, User, Phone, Mail, Lock } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || ''
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put('/auth/profile', profileForm);
      localStorage.setItem('user', JSON.stringify({ ...user, ...data }));
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await api.put('/auth/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      toast.success('Password updated successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This cannot be undone.')) return;
    try {
      await api.delete('/auth/profile');
      logout();
      navigate('/');
      toast.success('Account deleted');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete account');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-green-700 text-white px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate('/dashboard')} className="hover:text-green-200">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold">My Profile</h1>
          <p className="text-xs text-green-200">Manage your account</p>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow p-6 mb-6 flex items-center gap-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <User size={32} className="text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{user?.name}</h2>
            <p className="text-gray-500 text-sm">{user?.email}</p>
            <p className="text-gray-500 text-sm">{user?.phone}</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {['profile', 'password', 'danger'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${
                activeTab === tab
                  ? tab === 'danger' ? 'bg-red-500 text-white' : 'bg-green-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab === 'danger' ? 'Danger Zone' : tab}
            </button>
          ))}
        </div>

        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-bold mb-4">Update Profile</h3>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                    required
                    className="w-full border rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={profileForm.phone}
                    onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                    required
                    className="w-full border rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="email"
                    value={user?.email}
                    disabled
                    className="w-full border rounded-lg pl-9 pr-4 py-2 bg-gray-50 text-gray-400 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'password' && (
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-bold mb-4">Change Password</h3>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    required
                    className="w-full border rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    required
                    className="w-full border rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    required
                    className="w-full border rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'danger' && (
          <div className="bg-white rounded-2xl shadow p-6 border border-red-100">
            <h3 className="text-lg font-bold text-red-600 mb-2">Danger Zone</h3>
            <p className="text-gray-500 text-sm mb-6">
              Deleting your account is permanent and cannot be undone. All your data will be removed.
            </p>
            <button
              onClick={handleDeleteAccount}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition font-semibold"
            >
              Delete My Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;