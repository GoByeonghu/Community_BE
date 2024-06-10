// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { loginUser, authenticateUser, loginWithSession } = require('../controllers/authController');
const { verifyToken } = require('../utils/jwt');

// 로그인
router.post('/login', (req, res) => {
  loginUser(req, res, true);//쿠키저장
  //loginUser(req, res, false); //토큰 반환
});
router.post('/login-session', (req, res) => {
  loginWithSession(req, res);
});

// 로그아웃
router.post('/logout', (req, res) => {
  // 쿠키 이름이 'token'인 쿠키를 삭제
  res.clearCookie('token', { httpOnly: true, sameSite: 'Strict' });

  // 로그아웃이 성공했음을 클라이언트에게 응답
  res.status(200).json({ message: 'Logout successfully' });
});

// 토큰 유효성 확인
router.post('/check-token', (req, res) => {

  // 요청 헤더에서 토큰 추출
  const authHeader = req.headers.authorization;
    
  if (!authHeader) { //|| !authHeader.startsWith('token ')) {
    return res.status(401).json({ message: 'Authorization header is missing' });
  }
  const token = authHeader.split(' ')[1];

  const result = verifyToken(token);
  if (result) {
      //console.log('Token is valid:', result);
      return res.status(200).json({ message: 'ok' });
  } else {
      //console.log('Token is invalid or expired');
      return res.status(200).json({ message: 'Invalid token' });
  }

});

module.exports =router;