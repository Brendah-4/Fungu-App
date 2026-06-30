import { useNavigate } from 'react-router-dom';
import { Shield, TrendingUp, Users, FileText, Bell, Smartphone } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Shield size={32} className="text-green-600" />,
      title: 'Transparent Ledger',
      description: 'Every contribution is recorded and visible to all members. No more missing funds or disputed records.'
    },
    {
      icon: <TrendingUp size={32} className="text-green-600" />,
      title: 'Loan Management',
      description: 'Members can request loans, the group votes to approve, and repayments are tracked automatically.'
    },
    {
      icon: <Users size={32} className="text-green-600" />,
      title: 'Member Voting',
      description: 'Democratic decision making — every loan request requires majority approval from group members.'
    },
    {
      icon: <FileText size={32} className="text-green-600" />,
      title: 'Financial Statements',
      description: 'Generate professional PDF reports at any time. Perfect for bank loan applications.'
    },
    {
      icon: <Bell size={32} className="text-green-600" />,
      title: 'SMS Reminders',
      description: 'Automatic SMS reminders sent to members before contribution day. No more chasing people.'
    },
    {
      icon: <Smartphone size={32} className="text-green-600" />,
      title: 'Works on Any Device',
      description: 'Access your chama from your phone, tablet, or computer. Always up to date.'
    }
  ];

  const plans = [
    {
      name: 'Free Trial',
      price: 'KES 0',
      period: '30 days',
      features: ['All core features', 'Up to 50 members', 'SMS reminders', 'PDF statements'],
      cta: 'Start Free Trial',
      highlight: false
    },
    {
      name: 'Basic',
      price: 'KES 300',
      period: 'per month',
      features: ['All core features', 'Unlimited members', 'SMS reminders', 'PDF statements', 'Priority support'],
      cta: 'Get Started',
      highlight: true
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-green-700">FunguApp</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/login')}
            className="text-green-700 border border-green-700 px-4 py-2 rounded-lg hover:bg-green-50 transition text-sm font-medium"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/register')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm font-medium"
          >
            Get Started Free
          </button>
        </div>
      </nav>

      <section className="bg-gradient-to-br from-green-700 to-green-900 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Manage Your Chama With Full Transparency
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            FunguApp replaces WhatsApp groups and handwritten books with a secure, transparent digital platform for Kenyan savings groups.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => navigate('/register')}
              className="bg-white text-green-700 px-8 py-3 rounded-lg font-bold text-lg hover:bg-green-50 transition"
            >
              Start Free — 30 Days
            </button>
            <button
              onClick={() => navigate('/login')}
              className="border border-white text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-green-800 transition"
            >
              Login
            </button>
          </div>
          <p className="text-green-200 text-sm mt-4">No credit card required. Free for 30 days.</p>
        </div>
      </section>

      <section className="bg-green-50 py-12 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-3xl font-bold text-green-700">KES 300B</p>
            <p className="text-gray-500 text-sm mt-1">Managed by Kenyan chamas</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-green-700">7M+</p>
            <p className="text-gray-500 text-sm mt-1">Chama members in Kenya</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-green-700">KES 300</p>
            <p className="text-gray-500 text-sm mt-1">Per month per chama</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-green-700">30 days</p>
            <p className="text-gray-500 text-sm mt-1">Free trial, no card needed</p>
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-4">Everything Your Chama Needs</h3>
          <p className="text-center text-gray-500 mb-12">Built specifically for Kenyan savings groups</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition">
                <div className="mb-4">{f.icon}</div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">{f.title}</h4>
                <p className="text-gray-500 text-sm">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-4">Simple, Affordable Pricing</h3>
          <p className="text-center text-gray-500 mb-12">Less than the cost of a cup of tea per week</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.map((plan, i) => (
              <div key={i} className={`rounded-2xl p-8 ${plan.highlight ? 'bg-green-700 text-white shadow-xl' : 'bg-white border border-gray-200'}`}>
                <h4 className={`text-xl font-bold mb-1 ${plan.highlight ? 'text-white' : 'text-gray-800'}`}>{plan.name}</h4>
                <div className="flex items-end gap-1 mb-6">
                  <span className={`text-4xl font-bold ${plan.highlight ? 'text-white' : 'text-green-700'}`}>{plan.price}</span>
                  <span className={`text-sm mb-1 ${plan.highlight ? 'text-green-200' : 'text-gray-400'}`}>/{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className={`flex items-center gap-2 text-sm ${plan.highlight ? 'text-green-100' : 'text-gray-600'}`}>
                      <span className={`w-2 h-2 rounded-full ${plan.highlight ? 'bg-green-300' : 'bg-green-500'}`}></span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate('/register')}
                  className={`w-full py-3 rounded-lg font-semibold transition ${
                    plan.highlight
                      ? 'bg-white text-green-700 hover:bg-green-50'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-green-700 text-white py-16 px-6 text-center">
        <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Chama?</h3>
        <p className="text-green-100 mb-8 max-w-xl mx-auto">Join hundreds of Kenyan savings groups managing their money with full transparency on FunguApp.</p>
        <button
          onClick={() => navigate('/register')}
          className="bg-white text-green-700 px-8 py-3 rounded-lg font-bold text-lg hover:bg-green-50 transition"
        >
          Start Free Trial Today
        </button>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-8 px-6 text-center">
        <p className="text-white font-bold text-lg mb-2">FunguApp</p>
        <p className="text-sm">Transparent Chama Management for Kenya</p>
        <div className="flex justify-center gap-6 mt-4 text-xs">
          <button onClick={() => navigate('/terms')} className="hover:text-white transition">Terms of Service</button>
          <button onClick={() => navigate('/terms')} className="hover:text-white transition">Privacy Policy</button>
          <a href="mailto:support@funguapp.co.ke" className="hover:text-white transition">Contact Us</a>
        </div>
        <p className="text-xs mt-4">© 2026 FunguApp. Built with ❤️ in Nairobi.</p>
      </footer>
    </div>
  );
};

export default Landing;