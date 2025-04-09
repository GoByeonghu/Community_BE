// userRouter.js
const express =require( 'express');
const multer =require( 'multer');
const userController =require( '../controllers/userController.js');
const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();
const { checkLoginStatus, checkUserOwnership } = require('../controllers/authController');

// JSON 요청을 파싱하여 req.body에 저장
router.use(express.json()); 


// GET /api/users - 로그인한 사용자만 접근 가능
router.get('/', (req, res) => {
  userController.getAllUsers(req, res);
});

// POST /api/users
router.post('/', upload.single('profile_image'), async (req, res) => {
  const newUser = JSON.parse(req.body.userData); // 사용자 정보
  const imageFile = req.file; // 이미지 파일 여부 확인

  try {
    var user;
    if (imageFile) {
      // 이미지 파일이 있는 경우
      user = await userController.addUserWithImage(newUser, imageFile);
    } else {
      // 이미지 파일이 없는 경우
      user = await userController.addUser(newUser);
    }

    delete user.password;
    delete user.id;
    res.status(201).json({
      message: 'register success',
      data: {
        user: user
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/users/:nickname
router.get('/:nickname', checkLoginStatus, checkUserOwnership, (req, res) => {
  const user = req.user; // checkUserOwnership 미들웨어에서 설정한 req.user를 사용
  const responseData = {
    message: 'ok',
    data: {
      nickname: user.nickname,
      email:  user.email,
      profile_image:  user.profile_image,
      created_at:  user.created_at,
      updated_at:  user.updated_at
    },
  };
  res.json(responseData);
});

// PUT /api/users/:nickname - 특정 사용자 수정
router.put('/:nickname', checkLoginStatus, checkUserOwnership, upload.single('profile_image'), async (req, res) => {
  const userId = req.user.id;
  const newData = JSON.parse(req.body.userData); // 사용자 정보
  const imageFile = req.file; // 이미지 파일 여부 확인
  let updatedUser;

  if (imageFile) {
    // 이미지 파일이 있는 경우
    updatedUser= await userController.updateUserWithImage(userId, newData, imageFile);
  } else {
    // 이미지 파일이 없는 경우
    updatedUser= await userController.updateUser(userId, newData);
  }

  res.status(201).json(
    {
    'message' : 'update success',
    'data' : updatedUser
    }
  );

});

// DELETE /api/users/:nickname - 특정 사용자 삭제
router.delete('/:nickname', checkLoginStatus, checkUserOwnership, (req, res) => {
  const userId = req.user.id;
  let result = userController.deleteUser(userId); // userControl에서 특정 사용자를 삭제합니다.
  if(result){
    res.json({ message: 'User deleted successfully' });
  }
  else{
    res.status(401).json({ message: 'error' });
  }
});

// PATCH /api/users/:id - 특정 사용자의 비밀번호 변경
router.patch('/:nickname', checkLoginStatus, checkUserOwnership, async (req, res) => {
  const userId = req.user.id;
  const target = req.query.target; // 쿼리 파라미터에서 target 값을 가져옵니다.

  // target 값이 'password'인 경우에만 비밀번호를 변경합니다.
  if (target === 'password') {
    const newPassword = req.body.password; // 요청의 본문에서 새로운 비밀번호를 가져옵니다.
    const updatedUser = await userController.updateUser(userId, { password: newPassword }); // userControl에서 비밀번호를 변경합니다.
    res.json({ message: 'Password updated successfully', user: updatedUser });
  } else {
    // target이 'password'가 아닌 경우에는 잘못된 요청으로 처리합니다.
    res.status(400).json({ error: 'Invalid target parameter. Please provide "password" as target.' });
  }
});

module.exports = router;