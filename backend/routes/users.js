// users.js
const express = require('express');
const router = express.Router();
const {
  login,
  joinRoom,
  leaveRoom,
  getAllUsers,
  getUserRooms,
  pinChat,
  logout
} = require('../controllers/users');

// Assuming that addUser, joinRoom, etc., are already defined in your controller
// You might need to adjust based on actual implementations or add middleware

router.post('/login', login);
router.get('/logout', logout)
router.post('/joinRoom', joinRoom);
router.post('/leaveRoom', leaveRoom);
router.get('/', getAllUsers);
router.get('/rooms/:username', getUserRooms);
router.post('/pinChat', pinChat);

module.exports = router;
