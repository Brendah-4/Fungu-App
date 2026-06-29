const Notification = require('../models/Notification');

const createNotification = async (userId, type, title, message, chamaId = null) => {
  try {
    await Notification.create({
      user: userId,
      chama: chamaId,
      type,
      title,
      message
    });
  } catch (error) {
    console.error('Notification error:', error.message);
  }
};

const notifyAllMembers = async (members, type, title, message, chamaId) => {
  try {
    const notifications = members.map(memberId => ({
      user: memberId,
      chama: chamaId,
      type,
      title,
      message
    }));
    await Notification.insertMany(notifications);
  } catch (error) {
    console.error('Notification error:', error.message);
  }
};

module.exports = { createNotification, notifyAllMembers };