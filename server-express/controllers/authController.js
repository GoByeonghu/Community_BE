// controllers/authController.js
//const bcrypt = require('bcryptjs');
const users = require('../models/users/users.js');
const { generateToken } = require('../utils/jwt');
const { v4: uuidv4 } = require('uuid');

function authenticateUser(email, password) {
  const user = users.find(u => u.email === email);
  if (user && user.password === password) {         //bcrypt.compareSync(password, user.password)) {
    return user;
  }require
  return null;
}

function loginUser(req, res, useCookie) {
  const { email, password } = req.body;
  const user = authenticateUser(email, password);

  if (user) {
    const token = generateToken(user);

    if (useCookie) {
      res.cookie('token', token, { httpOnly: true });
      return res.json({ message: 'Login successful. Token stored in cookie.' });
    } else {
      return res.json({ message: 'Login successful', token });
    }
  }

  return res.status(401).json({ message: 'Invalid email or password' });
}

function loginWithSession(req, res) {
  const { email, password } = req.body;
  console.log("email: "+email);
  const user = authenticateUser(email, password);

  if (user) {
    // 고유 세션 토큰 생성
    const sessionToken = uuidv4();
    // 세션에 사용자 ID 대신 세션 토큰을 저장
    req.session.sessionToken = sessionToken;
    // 서버 측 세션 객체에 사용자 정보 저장
    req.sessionStore.set(sessionToken, { userId: user.id }, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error saving session' });
      }
      return res.json({ message: 'Login successful. Session established.' });
    });
  } else {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
}

module.exports = {loginUser, authenticateUser, loginWithSession };
