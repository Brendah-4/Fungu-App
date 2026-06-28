const Chama = require('../models/Chama');
const User = require('../models/User');
const Loan = require('../models/Loan');
const Contribution = require('../models/Contribution');

const getOwnerStats = async (req, res) => {
  try {
    const totalChamas = await Chama.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalContributions = await Contribution.countDocuments({ status: 'confirmed' });
    
    const contributionSum = await Contribution.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const loanSum = await Loan.aggregate([
      { $match: { status: { $in: ['approved', 'disbursed', 'repaid'] } } },
      { $group: { _id: null, total: { $sum: '$amount' }, fees: { $sum: '$platformFee' } } }
    ]);

    const recentChamas = await Chama.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    const totalMoneyManaged = contributionSum[0]?.total || 0;
    const totalLoanFees = loanSum[0]?.fees || 0;
    const subscriptionRevenue = totalChamas * 300;
    const totalRevenue = totalLoanFees + subscriptionRevenue;

    res.json({
      totalChamas,
      totalUsers,
      totalContributions,
      totalMoneyManaged,
      totalLoanFees,
      subscriptionRevenue,
      totalRevenue,
      recentChamas
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getOwnerStats };