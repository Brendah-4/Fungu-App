const { initiateSTKPush } = require('../utils/mpesa');
const Contribution = require('../models/Contribution');
const Chama = require('../models/Chama');
const Subscription = require('../models/Subscription');

const initiateContributionPayment = async (req, res) => {
  try {
    const { chamaId, phone, amount } = req.body;

    const chama = await Chama.findById(chamaId);
    if (!chama) {
      return res.status(404).json({ message: 'Chama not found' });
    }

    const isMember = chama.members.find(
      m => m.user.toString() === req.user._id.toString()
    );
    if (!isMember) {
      return res.status(403).json({ message: 'Not a member of this chama' });
    }

    const pendingContribution = await Contribution.create({
      chama: chamaId,
      member: req.user._id,
      amount,
      status: 'pending',
      period: {
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
      }
    });

    const callbackUrl = `${process.env.BACKEND_URL}/api/mpesa/callback/${pendingContribution._id}`;

    const result = await initiateSTKPush(
      phone,
      amount,
      chama.name.slice(0, 12),
      'Chama Contribution',
      callbackUrl
    );

    res.json({
      message: 'STK Push sent. Check your phone to complete payment.',
      checkoutRequestId: result.CheckoutRequestID,
      contributionId: pendingContribution._id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const handleContributionCallback = async (req, res) => {
  try {
    const { contributionId } = req.params;
    const callbackData = req.body.Body.stkCallback;

    const contribution = await Contribution.findById(contributionId);
    if (!contribution) {
      return res.status(404).json({ message: 'Contribution not found' });
    }

    if (callbackData.ResultCode === 0) {
      const items = callbackData.CallbackMetadata.Item;
      const mpesaReceipt = items.find(i => i.Name === 'MpesaReceiptNumber')?.Value;

      contribution.status = 'confirmed';
      contribution.mpesaRef = mpesaReceipt;
      await contribution.save();

      const chama = await Chama.findById(contribution.chama);
      chama.balance += contribution.amount;
      await chama.save();
    } else {
      contribution.status = 'failed';
      await contribution.save();
    }

    res.json({ message: 'Callback processed' });
  } catch (error) {
    console.error('Callback error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const checkContributionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const contribution = await Contribution.findById(id);
    if (!contribution) {
      return res.status(404).json({ message: 'Contribution not found' });
    }
    res.json({ status: contribution.status });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const initiateSubscriptionPayment = async (req, res) => {
  try {
    const { chamaId, phone } = req.body;

    const chama = await Chama.findById(chamaId);
    if (!chama) {
      return res.status(404).json({ message: 'Chama not found' });
    }

    const isChairperson = chama.members.find(
      m => m.user.toString() === req.user._id.toString() && m.role === 'chairperson'
    );
    if (!isChairperson) {
      return res.status(403).json({ message: 'Only chairperson can pay subscription' });
    }

    const callbackUrl = `${process.env.BACKEND_URL}/api/mpesa/subscription-callback/${chamaId}`;

    const result = await initiateSTKPush(
      phone,
      300,
      'FunguApp',
      'Monthly Subscription',
      callbackUrl
    );

    res.json({
      message: 'STK Push sent. Check your phone to complete payment.',
      checkoutRequestId: result.CheckoutRequestID
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const handleSubscriptionCallback = async (req, res) => {
  try {
    const { chamaId } = req.params;
    const callbackData = req.body.Body.stkCallback;

    const chama = await Chama.findById(chamaId);
    if (!chama) {
      return res.status(404).json({ message: 'Chama not found' });
    }

    if (callbackData.ResultCode === 0) {
      const items = callbackData.CallbackMetadata.Item;
      const mpesaReceipt = items.find(i => i.Name === 'MpesaReceiptNumber')?.Value;

      const paidUntil = new Date();
      paidUntil.setMonth(paidUntil.getMonth() + 1);

      chama.subscription.plan = 'basic';
      chama.subscription.status = 'active';
      chama.subscription.paidUntil = paidUntil;
      chama.subscription.mpesaRef = mpesaReceipt;
      await chama.save();
    }

    res.json({ message: 'Callback processed' });
  } catch (error) {
    console.error('Callback error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  initiateContributionPayment,
  handleContributionCallback,
  checkContributionStatus,
  initiateSubscriptionPayment,
  handleSubscriptionCallback
};