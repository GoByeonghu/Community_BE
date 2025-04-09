const db = require('../database/models');
const User = db.models.users;

async function authenticateUser(email, password) {
  try {
    const user = await User.findOne({
      where: {
        email: email
      }
    });

    if (user && user.password === password) {
      console.log("111");
      return user;
    } else {
      console.log("222");
      return null;
    }
  } catch (error) {
    console.error('Error in authentication:', error);
    return null;
  }
}

async function loginWithSession(req, res) {
  const { email, password } = req.body;
  
  try {
    const user = await authenticateUser(email, password);
    
    if (user) {
      req.session.userId = user.id; // 세션에 사용자 정보 저장
      console.log("Login successful. Session established.");
      console.log(user.id);
      console.log(req.session.userId);
      return res.json({ message: 'Login successful. Session established.' });
    } else {
      console.log("Invalid email or password");
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error in login:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}


function logoutWithSession(req, res) {
  // 세션에서 사용자 정보를 삭제
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    res.clearCookie('connect.sid'); // 세션 쿠키 삭제
    return res.json({ message: 'Logout successful. Session destroyed.' });
  });
}

// checkLoginStatus 미들웨어를 비동기 함수로 변경
async function checkLoginStatus(req, res, next) {
  if (req.session && req.session.userId) {
    try {
      const user = await User.findByPk(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      // 사용자 정보를 req 객체에 저장하여 다음 미들웨어에서 사용 가능하도록 함
      req.user = user;
      next(); // 세션이 유효하고 사용자가 존재하면 다음 미들웨어 또는 라우트 핸들러로 진행
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  } else {
    res.status(401).json({ message: 'Not logged in' }); // 세션이 없으면 인증 실패 응답
  }
}


// nickname으로 user의 id를 찾아서 session.userId와 비교하는 함수
async function checkUserOwnership(req, res, next) {
  if (req.user.nickname === req.params.nickname) {
    next(); // 사용자 인증이 되었으면 다음 미들웨어 또는 라우트 핸들러로 진행
  } else {
    res.status(401).json({ message: 'Unauthorized' }); // 인증 실패 응답
  }
}


module.exports = { authenticateUser, loginWithSession, logoutWithSession, checkLoginStatus, checkUserOwnership};
