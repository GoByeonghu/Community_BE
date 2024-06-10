// utils/jwt.js
const jwt = require('jsonwebtoken');
const secretKey=require('../localsetting');
//const secretKey = 'your_secret_key'; 

function generateToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '24h' });
}

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded; // 유효한 경우, 디코딩된 페이로드 반환
} catch (error) {
    console.error('Token verification failed:', error.message);
    return null; // 유효하지 않은 경우, null 반환
}
}

module.exports = { generateToken, verifyToken };
