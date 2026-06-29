const Loan = require('../models/Loan');
const Chama = require('../models/Chama');
const User = require('../models/User');
const { sendLoanApprovalSMS } = require('../utils/sms');

const requestLoan = async (req, res) => {
  try {
    const { chamaId, amount, reason } = req.body;

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

    if (amount > chama.balance) {
      return res.status(400).json({ message: 'Amount exceeds chama balance' });
    }

    const interestRate = 5;
    const totalRepayable = amount + (amount * interestRate) / 100;
    const platformFee = amount * 0.005;

    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + 3);

    const loan = await Loan.create({
      chama: chamaId,
      member: req.user._id,
      amount,
      reason,
      interestRate,
      totalRepayable,
      platformFee,
      dueDate
    });

    res.status(201).json(loan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const voteLoan = async (req, res) => {
  try {
    const { vote } = req.body;
    const loan = await Loan.findById(req.params.id);

    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    const chama = await Chama.findById(loan.chama);
    const isMember = chama.members.find(
      m => m.user.toString() === req.user._id.toString()
    );
    if (!isMember) {
      return res.status(403).json({ message: 'Not a member of this chama' });
    }

    const alreadyVoted = loan.votes.find(
      v => v.member.toString() === req.user._id.toString()
    );
    if (alreadyVoted) {
      return res.status(400).json({ message: 'You have already voted' });
    }

    loan.votes.push({ member: req.user._id, vote });

    const totalMembers = chama.members.length;
    const approvals = loan.votes.filter(v => v.vote === 'approve').length;
    const rejections = loan.votes.filter(v => v.vote === 'reject').length;

    if (approvals > totalMembers / 2) {
      loan.status = 'approved';
      const borrower = await User.findById(loan.member);
      if (borrower) {
        sendLoanApprovalSMS(borrower.phone, borrower.name, loan.amount, chama.name);
      }
    } else if (rejections > totalMembers / 2) {
      loan.status = 'rejected';
    }

    await loan.save();
    res.json(loan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getChamaLoans = async (req, res) => {
  try {
    const { chamaId } = req.params;

    const loans = await Loan.find({ chama: chamaId })
      .populate('member', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ member: req.user._id })
      .populate('chama', 'name')
      .sort({ createdAt: -1 });

    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const repayLoan = async (req, res) => {
  try {
    const { amount, mpesaRef } = req.body;
    const loan = await Loan.findById(req.params.id);

    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    if (loan.member.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not your loan' });
    }

    loan.amountRepaid += amount;

    if (loan.amountRepaid >= loan.totalRepayable) {
      loan.status = 'repaid';
      loan.repaidAt = new Date();

      const chama = await Chama.findById(loan.chama);
      chama.balance += loan.totalRepayable;
      await chama.save();
    }

    await loan.save();
    res.json(loan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { requestLoan, voteLoan, getChamaLoans, getMyLoans, repayLoan };