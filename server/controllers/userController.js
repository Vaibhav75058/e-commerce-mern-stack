const User = require('../models/User');
const axios = require('axios');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.isAdmin) {
      return res.status(400).json({ message: 'Cannot delete admin user' });
    }
    await user.deleteOne();
    res.json({ message: 'User removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const savePushToken = async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.pushToken = token || "";
    await user.save();
    res.json({ message: 'Push token saved successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const broadcastPushNotification = async (req, res) => {
  try {
    const { title, body, screen } = req.body;
    if (!title || !body) {
      return res.status(400).json({ message: 'Title and body are required' });
    }

    const users = await User.find({ pushToken: { $ne: "" } }).select('pushToken');
    const tokens = users.map(u => u.pushToken).filter(t => t && t.startsWith('ExponentPushToken'));

    if (tokens.length === 0) {
      return res.json({ message: 'No registered push tokens found to send' });
    }

    const messages = tokens.map(token => ({
      to: token,
      sound: 'default',
      title: title,
      body: body,
      data: { screen: screen || 'Home' }
    }));

    const response = await axios.post('https://exp.host/--/api/v2/push/send', messages, {
      headers: {
        'Content-Type': 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Accept': 'application/json'
      }
    });

    res.json({
      message: `Successfully sent broadcast to ${tokens.length} devices`,
      expoResponse: response.data
    });
  } catch (error) {
    res.status(500).json({ message: error.response?.data || error.message });
  }
};

module.exports = { getAllUsers, deleteUser, getUserById, savePushToken, broadcastPushNotification };