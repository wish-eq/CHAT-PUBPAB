const User = require('../models/User');
const Room = require('../models/Room');
const Message = require('../models/Message');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId; // Correct way to import ObjectId

const login = async (userId, username) => {
  console.log("Attempting to log in with userId:", userId);  // Debugging line
  try {
      const user = await User.findOneAndUpdate(
          { username: username },
          { $setOnInsert: { socket_id: userId, rooms: [] } },
          { upsert: true, new: true }
      );
      console.log("User logged in or created:", user);
  } catch (error) {
      console.error('Error adding user:', error);
  }
};

//Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken()
  const options = {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: false
  };
  if (process.env.NODE_ENV === 'production') {
      options.secure = true;
  }

  res.status(statusCode).cookie('token', token, options).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      tel: user.tel,
      token
  })
}

const logout = async (req, res, next) => {
  res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
  });

  res.status(200).json({
      success: true,
      msg: "Logout successful",
      data: {}
  });
}


const joinRoom = async (userId, username, roomName, isPrivate = false) => {
  const room = await Room.findOneAndUpdate({ room: roomName }, { $setOnInsert: { userCount: 0, latestMessage: '', private: isPrivate } }, { upsert: true, new: true });
  const user = await User.findOneAndUpdate({ username: username }, { $addToSet: { rooms: room._id } }, { new: true });
  await Room.updateOne({ _id: room._id }, { $inc: { userCount: 1 } });
  console.log(room);
  console.log(user);
};

const leaveRoom = async (username, roomName) => {
  const user = await User.findOne({ username: username });
  if (!user || user.rooms.length === 0) return;

  const room = await Room.findOne({ room: roomName });
  if (!room) return;

  await User.updateOne({ _id: user._id }, { $pull: { rooms: room._id } });
  const updatedRoom = await Room.findByIdAndUpdate(room._id, { $inc: { userCount: -1 } }, { new: true });

  if (updatedRoom.userCount === 0) {
    await Room.deleteOne({ _id: updatedRoom._id });
  }
};

const getCurrentUser = async (username) => {
  const user = await User.findOne({ username: username });
  return user;
};

const getAllUsers = async () => {
  const users = await User.find({});
  return users.map(user => user.username);
};

const getAllRooms = async (isPrivate) => {
  const rooms = await Room.find({ private: isPrivate });
  return rooms;
};

const getUserRooms = async (username) => {
  const user = await User.findOne({ username: username }).populate('rooms');
  return user ? user.rooms : [];
};

const pinChat = async (username, roomName, pinStatus) => {
  const user = await User.findOne({ username: username });
  if (!user) return;

  const room = await Room.findOne({ room: roomName });
  if (!room) return;

  const roomIndex = user.rooms.indexOf(room._id);
  if (roomIndex !== -1) {
    // Assuming the user document includes information about pinned status per room
    // This might require schema changes to store room-specific preferences
    user.rooms[roomIndex].pin = pinStatus;
    await user.save();
    console.log(user.rooms);
  }
};

const updateLatestMessage = async (messageData) => {
  const room = await Room.findOne({ room: messageData.room });
  if (!room) return false;

  const message = new Message({
    author: messageData.author,
    message: messageData.message,
    time: new Date(),
    room: room._id
  });
  await message.save();

  room.latestMessage = message._id;
  await room.save();

  return true;
};

const sendMessage = async (messageData) => {
  const message = await updateLatestMessage(messageData);
  if (!message) return null;
  console.log('Message sent and updated in room');
  return message;
};

const unsendMessage = async (messageId) => {
  await Message.findByIdAndDelete(messageId);
};

const announceMessage = async (messageId) => {
  await Message.findByIdAndUpdate(messageId, { announce: true });
};

const removeAnnounce = async (roomName) => {
  const room = await Room.findOne({ room: roomName });
  if (!room) return;

  await Message.updateMany({ room: room._id }, { announce: false });
};

const getMessageInRoom = async (roomName) => {
  const room = await Room.findOne({ room: roomName });
  if (!room) return [];

  const messages = await Message.find({ room: room._id });
  console.log(messages);
  return messages;
};

module.exports = {
  login,
  logout,
  joinRoom,
  leaveRoom,
  getCurrentUser,
  getAllUsers,
  getAllRooms,
  getUserRooms,
  pinChat,
  sendMessage,
  unsendMessage,
  announceMessage,
  removeAnnounce,
  getMessageInRoom,
};
