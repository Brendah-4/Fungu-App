const Chama = require('../models/Chama');
const crypto = require('crypto');

const generateInviteCode = () => {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
};

const createChama = async (req, res) => {
  try {
    const { name, description, rules } = req.body;

    const inviteCode = generateInviteCode();

    const chama = await Chama.create({
      name,
      description,
      inviteCode,
      createdBy: req.user._id,
      members: [{ user: req.user._id, role: 'chairperson' }],
      rules
    });

    res.status(201).json(chama);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const joinChama = async (req, res) => {
  try {
    const { inviteCode } = req.body;

    const chama = await Chama.findOne({
      inviteCode: inviteCode.toString().trim().toUpperCase()
    });

    if (!chama) {
      return res.status(404).json({ message: 'Invalid invite code' });
    }

    const alreadyMember = chama.members.find(
      m => m.user.toString() === req.user._id.toString()
    );
    if (alreadyMember) {
      return res.status(400).json({ message: 'You are already a member' });
    }

    chama.members.push({ user: req.user._id, role: 'member' });
    await chama.save();

    res.json({ message: 'Joined chama successfully', chama });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyChamas = async (req, res) => {
  try {
    const chamas = await Chama.find({ 'members.user': req.user._id })
      .populate('members.user', 'name email phone')
      .populate('createdBy', 'name email');

    res.json(chamas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getChamaById = async (req, res) => {
  try {
    const chama = await Chama.findById(req.params.id)
      .populate('members.user', 'name email phone')
      .populate('createdBy', 'name email');

    if (!chama) {
      return res.status(404).json({ message: 'Chama not found' });
    }

    const isMember = chama.members.find(
      m => m.user._id.toString() === req.user._id.toString()
    );
    if (!isMember) {
      return res.status(403).json({ message: 'Not a member of this chama' });
    }

    res.json(chama);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateChama = async (req, res) => {
  try {
    const chama = await Chama.findById(req.params.id);

    if (!chama) {
      return res.status(404).json({ message: 'Chama not found' });
    }

    const isChairperson = chama.members.find(
      m => m.user.toString() === req.user._id.toString() && m.role === 'chairperson'
    );
    if (!isChairperson) {
      return res.status(403).json({ message: 'Only chairperson can update chama' });
    }

    const updated = await Chama.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createChama, joinChama, getMyChamas, getChamaById, updateChama };