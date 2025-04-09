// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { loginWithSession, logoutWithSession, checkLoginStatus } = require('../controllers/authController');
const db = require('../database/models');

const User = db.models.users;

// 로그인 (세션 사용)
router.post('/login-session', (req, res) => {
  loginWithSession(req, res);
});

// 로그아웃
router.post('/logout-session', (req, res) => {
  logoutWithSession(req, res);
});

// 로그인 여부 확인 (세션 기반)
router.post('/check-session', checkLoginStatus, async (req, res) => {
  return res.status(200).json({ message: 'ok', nickname: req.user.nickname });
});
 

module.exports = router;
