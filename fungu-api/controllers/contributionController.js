const Contribution = require('../models/Contribution');
const Chama = require('../models/Chama');
const User = require('../models/User');
const { sendContributionReminder } = require('../utils/sms');
const { notifyAllMembers } = require('../utils/notify');

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

    const memberIds = chama.members.map(m => m.user);
    await notifyAllMembers(
      memberIds,
      'contribution',
      'New Contribution',
      `${req.user.name} contributed KES ${amount.toLocaleString()} to ${chama.name}`,
      chamaId
    );

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

const sendReminders = async (req, res) => {
  try {
    const { chamaId } = req.params;

    const chama = await Chama.findById(chamaId).populate('members.user', 'name phone');
    if (!chama) {
      return res.status(404).json({ message: 'Chama not found' });
    }

    const isChairperson = chama.members.find(
      m => m.user._id.toString() === req.user._id.toString() && m.role === 'chairperson'
    );
    if (!isChairperson) {
      return res.status(403).json({ message: 'Only chairperson can send reminders' });
    }

    const members = chama.members.map(m => m.user);
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 3);
    const dueDateStr = dueDate.toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' });

    await sendContributionReminder(members, chama.name, chama.rules.contributionAmount, dueDateStr);

    const memberIds = chama.members.map(m => m.user._id);
    await notifyAllMembers(
      memberIds,
      'reminder',
      'Contribution Reminder',
      `Your contribution of KES ${chama.rules.contributionAmount.toLocaleString()} for ${chama.name} is due on ${dueDateStr}`,
      chamaId
    );

    res.json({ message: `Reminders sent to ${members.length} members` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  makeContribution,
  getChamaContributions,
  getMyContributions,
  getMemberSummary,
  sendReminders
};