// utils/authMiddleware.js
const users = require('../models/users/users.js');

function ensureAuthenticated(req, res, next) {
  const sessionToken = req.session.sessionToken;
  if (sessionToken) {
    req.sessionStore.get(sessionToken, (err, session) => {
      if (err || !session) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      // 세션 갱신
      req.sessionStore.touch(sessionToken, session, (touchErr) => {
        if (touchErr) {
          return res.status(500).json({ message: 'Failed to update session' });
        }
        // 세션에서 사용자 정보 가져오기
        const user = users.find(u => u.id === session.userId);
        if (user) {
          req.user = user; // req 객체에 사용자 정보 추가
          return next(); // 다음 미들웨어 또는 라우트 핸들러로 이동
        } else {
          return res.status(401).json({ message: 'Unauthorized' });
        }
      });
    });
  } else {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

module.exports = ensureAuthenticated;
