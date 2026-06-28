const Chama = require('../models/Chama');

const getSubscriptionStatus = async (req, res) => {
  try {
    const chama = await Chama.findById(req.params.chamaId);
    if (!chama) {
      return res.status(404).json({ message: 'Chama not found' });
    }

    const isMember = chama.members.find(
      m => m.user.toString() === req.user._id.toString()
    );
    if (!isMember) {
      return res.status(403).json({ message: 'Not a member of this chama' });
    }

    const now = new Date();
    const isActive = chama.isSubscriptionActive();
    const daysLeft = chama.subscription.plan === 'trial'
      ? Math.ceil((chama.subscription.trialEndDate - now) / (1000 * 60 * 60 * 24))
      : Math.ceil((chama.subscription.paidUntil - now) / (1000 * 60 * 60 * 24));

    res.json({
      plan: chama.subscription.plan,
      status: chama.subscription.status,
      isActive,
      daysLeft: Math.max(0, daysLeft),
      trialEndDate: chama.subscription.trialEndDate,
      paidUntil: chama.subscription.paidUntil
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const activateSubscription = async (req, res) => {
  try {
    const { chamaId, mpesaRef } = req.body;

    const chama = await Chama.findById(chamaId);
    if (!chama) {
      return res.status(404).json({ message: 'Chama not found' });
    }

    const isChairperson = chama.members.find(
      m => m.user.toString() === req.user._id.toString() && m.role === 'chairperson'
    );
    if (!isChairperson) {
      return res.status(403).json({ message: 'Only chairperson can activate subscription' });
    }

    const now = new Date();
    const paidUntil = new Date();
    paidUntil.setMonth(paidUntil.getMonth() + 1);

    chama.subscription.plan = 'basic';
    chama.subscription.status = 'active';
    chama.subscription.paidUntil = paidUntil;
    chama.subscription.mpesaRef = mpesaRef;

    await chama.save();

    res.json({
      message: 'Subscription activated successfully',
      paidUntil,
      plan: 'basic'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllSubscriptions = async (req, res) => {
  try {
    const chamas = await Chama.find()
      .populate('createdBy', 'name email phone')
      .select('name subscription members createdAt');

    const now = new Date();
    const result = chamas.map(chama => ({
      _id: chama._id,
      name: chama.name,
      createdBy: chama.createdBy,
      members: chama.members.length,
      plan: chama.subscription.plan,
      status: chama.subscription.status,
      isActive: chama.isSubscriptionActive(),
      trialEndDate: chama.subscription.trialEndDate,
      paidUntil: chama.subscription.paidUntil,
      daysLeft: chama.subscription.plan === 'trial'
        ? Math.max(0, Math.ceil((chama.subscription.trialEndDate - now) / (1000 * 60 * 60 * 24)))
        : Math.max(0, Math.ceil((chama.subscription.paidUntil - now) / (1000 * 60 * 60 * 24)))
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSubscriptionStatus, activateSubscription, getAllSubscriptions };