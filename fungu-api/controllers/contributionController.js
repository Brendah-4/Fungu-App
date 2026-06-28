const Contribution = require('../models/Contribution');
const Chama = require('../models/Chama');

const makeContribution = async (req, res) => {
  try {
    const { chamaId, amount, mpesaRef, notes } = req.body;

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

    const now = new Date();

    const contribution = await Contribution.create({
      chama: chamaId,
      member: req.user._id,
      amount,
      mpesaRef,
      notes,
      status: 'confirmed',
      period: {
        month: now.getMonth() + 1,
        year: now.getFullYear()
      }
    });

    chama.balance += amount;
    await chama.save();

    res.status(201).json(contribution);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getChamaContributions = async (req, res) => {
  try {
    const { chamaId } = req.params;

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

    const contributions = await Contribution.find({ chama: chamaId })
      .populate('member', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(contributions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyContributions = async (req, res) => {
  try {
    const contributions = await Contribution.find({ member: req.user._id })
      .populate('chama', 'name')
      .sort({ createdAt: -1 });

    res.json(contributions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMemberSummary = async (req, res) => {
  try {
    const { chamaId } = req.params;

    const contributions = await Contribution.find({
      chama: chamaId,
      status: 'confirmed'
    }).populate('member', 'name email phone');

    const summary = {};
    contributions.forEach(c => {
      const memberId = c.member._id.toString();
      if (!summary[memberId]) {
        summary[memberId] = {
          member: c.member,
          totalContributed: 0,
          contributions: 0
        };
      }
      summary[memberId].totalContributed += c.amount;
      summary[memberId].contributions += 1;
    });

    res.json(Object.values(summary));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  makeContribution,
  getChamaContributions,
  getMyContributions,
  getMemberSummary
};