import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-green-700 text-white px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="hover:text-green-200">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold">Terms & Privacy</h1>
      </nav>

      <div className="max-w-3xl mx-auto p-6 space-y-8">
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Terms of Service</h2>
          <p className="text-gray-400 text-sm mb-6">Last updated: June 2026</p>

          <div className="space-y-6 text-gray-600 text-sm leading-relaxed">
            <div>
              <h3 className="font-bold text-gray-800 mb-2">1. Acceptance of Terms</h3>
              <p>By accessing or using FunguApp, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the platform.</p>
            </div>

            <div>
              <h3 className="font-bold text-gray-800 mb-2">2. Description of Service</h3>
              <p>FunguApp is a digital platform that helps Kenyan savings groups (chamas) manage contributions, loans, and financial records. We provide tools for transparency and accountability — we do not hold, manage, or invest your money directly.</p>
            </div>

            <div>
              <h3 className="font-bold text-gray-800 mb-2">3. User Responsibilities</h3>
              <p>You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate information when registering. You agree not to use the platform for fraudulent or illegal purposes. Each chama's financial decisions are the sole responsibility of its members.</p>
            </div>

            <div>
              <h3 className="font-bold text-gray-800 mb-2">4. Subscription and Payments</h3>
              <p>FunguApp offers a 30-day free trial for new chamas. After the trial period, a subscription fee of KES 300 per month is required to continue using the platform. Subscription fees are non-refundable. We reserve the right to change subscription pricing with 30 days notice.</p>
            </div>

            <div>
              <h3 className="font-bold text-gray-800 mb-2">5. Loan Transactions</h3>
              <p>FunguApp charges a 0.5% platform fee on loans disbursed through the platform. This fee is automatically calculated and disclosed before any loan is approved. All loan agreements are between chama members — FunguApp is not a lender and assumes no liability for loan defaults.</p>
            </div>

            <div>
              <h3 className="font-bold text-gray-800 mb-2">6. Limitation of Liability</h3>
              <p>FunguApp is a record-keeping and management tool. We are not liable for financial losses arising from chama decisions, member disputes, or misuse of the platform. We do not guarantee the accuracy of financial records entered by users.</p>
            </div>

            <div>
              <h3 className="font-bold text-gray-800 mb-2">7. Termination</h3>
              <p>We reserve the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or fail to pay subscription fees after the grace period.</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Privacy Policy</h2>
          <p className="text-gray-400 text-sm mb-6">Last updated: June 2026</p>

          <div className="space-y-6 text-gray-600 text-sm leading-relaxed">
            <div>
              <h3 className="font-bold text-gray-800 mb-2">1. Information We Collect</h3>
              <p>We collect information you provide when registering (name, email, phone number), financial transaction records you enter on the platform, and usage data to improve the service.</p>
            </div>

            <div>
              <h3 className="font-bold text-gray-800 mb-2">2. How We Use Your Information</h3>
              <p>We use your information to provide and improve the FunguApp service, send SMS reminders and notifications, generate financial reports for your chama, and process subscription payments.</p>
            </div>

            <div>
              <h3 className="font-bold text-gray-800 mb-2">3. Data Sharing</h3>
              <p>We do not sell your personal data to third parties. Financial data is shared only with members of your chama. We may share anonymized, aggregate data with financial partners for service improvement purposes.</p>
            </div>

            <div>
              <h3 className="font-bold text-gray-800 mb-2">4. Data Security</h3>
              <p>All data is encrypted in transit and at rest. Passwords are hashed and never stored in plain text. We use industry-standard security practices to protect your information.</p>
            </div>

            <div>
              <h3 className="font-bold text-gray-800 mb-2">5. Your Rights</h3>
              <p>You have the right to access, update, or delete your personal data at any time through your profile settings. To request complete data deletion, contact us at support@funguapp.co.ke.</p>
            </div>

            <div>
              <h3 className="font-bold text-gray-800 mb-2">6. Contact</h3>
              <p>For any questions about these terms or our privacy practices, contact us at support@funguapp.co.ke or visit our office in Nairobi, Kenya.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;