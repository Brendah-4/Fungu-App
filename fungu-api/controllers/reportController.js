const Chama = require('../models/Chama');
const Contribution = require('../models/Contribution');
const Loan = require('../models/Loan');
const { generateFinancialStatement } = require('../utils/generatePDF');

const downloadFinancialStatement = async (req, res) => {
  try {
    const { chamaId } = req.params;

    const chama = await Chama.findById(chamaId).populate('members.user', 'name email phone');
    if (!chama) {
      return res.status(404).json({ message: 'Chama not found' });
    }

    const isMember = chama.members.find(
      m => m.user._id.toString() === req.user._id.toString()
    );
    if (!isMember) {
      return res.status(403).json({ message: 'Not a member of this chama' });
    }

    const contributions = await Contribution.find({ chama: chamaId, status: 'confirmed' })
      .populate('member', 'name')
      .sort({ createdAt: -1 });

    const loans = await Loan.find({ chama: chamaId })
      .populate('member', 'name')
      .sort({ createdAt: -1 });

    const summaryMap = {};
    contributions.forEach(c => {
      const memberId = c.member._id.toString();
      if (!summaryMap[memberId]) {
        summaryMap[memberId] = {
          member: c.member,
          totalContributed: 0,
          contributions: 0
        };
      }
      summaryMap[memberId].totalContributed += c.amount;
      summaryMap[memberId].contributions += 1;
    });
    const memberSummary = Object.values(summaryMap);

    const pdfBuffer = await generateFinancialStatement(chama, contributions, loans, memberSummary);

    const filename = `${chama.name.replace(/\s+/g, '_')}_Financial_Statement.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { downloadFinancialStatement };