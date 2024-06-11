// userRouter.js
const express =require( 'express');
const multer =require( 'multer');
const userControl =require( '../controllers/userController.js');
const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

const session = require('express-session');
const SessionModel = require('../models/sessions/sessionsModel.js'); // 스토어 경로
const authController = require('../controllers/authController');
const ensureAuthenticated = require('../utils/AuthMiddleware.js'); // 미들웨어 경로에 맞게 설정

// JSON 요청을 파싱하여 req.body에 저장
router.use(express.json()); 

// GET /api/users
router.get('/', (req, res) => {
  const users = userControl.getAllUsers();
  //res.json({ message: 'This is a protected route', user: req.user });
  res.json(users);
});

// POST /api/users
router.post('/',  ensureAuthenticated, upload.single('profile_image'), (req, res) => {
  const newUser = JSON.parse(req.body.userData); // 사용자 정보
  const imageFile = req.file; // 이미지 파일 여부 확인
  let userID;

  if (imageFile) {
    // 이미지 파일이 있는 경우
    userID=userControl.addUserWithImage(newUser, imageFile);
  } else {
    // 이미지 파일이 없는 경우
    userID=userControl.addUser(newUser);
  }

  res.status(201).json(
    {
    'message' : 'register success',
    'data' : {
      'user_id' : userID
      }
    }
  );

});

// GET /api/users/:id
router.get('/:id', ensureAuthenticated,(req, res) => {
  const userId = req.params.id;
  const user = userControl.getUserById(userId);
  if (!user) {
    return res.status(404).json({ message: 'non-existent user', data : null });
  }
  delete user.password;
  res.json({'message':'ok','data':user});
});

// PUT /api/users/:id - 특정 사용자 수정
router.put('/:id', ensureAuthenticated, upload.single('profile_image'), (req, res) => {
  const userId = req.params.id;
  const newData = JSON.parse(req.body.userData); // 사용자 정보
  const imageFile = req.file; // 이미지 파일 여부 확인
  let updatedUser;

  if (imageFile) {
    // 이미지 파일이 있는 경우
    updatedUser=userControl.updateUserWithImage(userId, newData, imageFile);
  } else {
    // 이미지 파일이 없는 경우
    updatedUser=userControl.updateUser(userId, newData);
  }

  res.status(201).json(
    {
    'message' : 'update success',
    'data' : updatedUser
    }
  );

});

// DELETE /api/users/:id - 특정 사용자 삭제
router.delete('/:id', ensureAuthenticated, (req, res) => {
  const userId = req.params.id;
  userControl.deleteUser(userId); // userControl에서 특정 사용자를 삭제합니다.
  res.json({ message: 'User deleted successfully' });
});

// PATCH /api/users/:id - 특정 사용자의 비밀번호 변경
router.patch('/:id', ensureAuthenticated, (req, res) => {
  const userId = req.params.id;
  const target = req.query.target; // 쿼리 파라미터에서 target 값을 가져옵니다.

  // target 값이 'password'인 경우에만 비밀번호를 변경합니다.
  if (target === 'password') {
    const newPassword = req.body.password; // 요청의 본문에서 새로운 비밀번호를 가져옵니다.
    const updatedUser = userControl.updateUser(userId, { password: newPassword }); // userControl에서 비밀번호를 변경합니다.
    res.json({ message: 'Password updated successfully', user: updatedUser });
  } else {
    // target이 'password'가 아닌 경우에는 잘못된 요청으로 처리합니다.
    res.status(400).json({ error: 'Invalid target parameter. Please provide "password" as target.' });
  }
});

module.exports = router;