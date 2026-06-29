const AfricasTalking = require('africastalking');

const at = AfricasTalking({
  apiKey: process.env.AT_API_KEY,
  username: process.env.AT_USERNAME
});

const sms = at.SMS;

const sendSMS = async (to, message) => {
  try {
    const result = await sms.send({
      to: Array.isArray(to) ? to : [to],
      message
    });
    console.log('SMS sent:', JSON.stringify(result));
    return result;
  } catch (error) {
    console.error('SMS error:', error.message);
  }
};

const sendContributionReminder = async (members, chamaName, amount, dueDate) => {
  const message = `FunguApp Reminder: Your contribution of KES ${amount} for ${chamaName} is due on ${dueDate}. Log in to record your payment.`;
  const phones = members.map(m => m.phone.startsWith('+') ? m.phone : `+254${m.phone.slice(1)}`);
  return await sendSMS(phones, message);
};

const sendLoanApprovalSMS = async (phone, memberName, amount, chamaName) => {
  const message = `FunguApp: Hi ${memberName}, your loan request of KES ${amount} from ${chamaName} has been approved.`;
  const formattedPhone = phone.startsWith('+') ? phone : `+254${phone.slice(1)}`;
  return await sendSMS(formattedPhone, message);
};

const sendWelcomeSMS = async (phone, name) => {
  const message = `Welcome to FunguApp ${name}! You can now manage your chama savings digitally.`;
  const formattedPhone = phone.startsWith('+') ? phone : `+254${phone.slice(1)}`;
  return await sendSMS(formattedPhone, message);
};

module.exports = { sendSMS, sendContributionReminder, sendLoanApprovalSMS, sendWelcomeSMS };