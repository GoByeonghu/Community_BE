const express=require('express');
const app = express();
const cookieParser = require('cookie-parser'); // cookie-parser 모듈을 임포트
const session = require('express-session');
const { profileImageDirectory, postImageDirectory, secretKey } = require('./localsetting.js');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
//const ensureAuthenticated = require('./utils/AuthMiddleware.js/authMiddleware');


const SessionModel = require('./models/sessions/sessionsModel.js'); 

// 미들웨어 설정
// const bodyParser = require('body-parser');
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json()); // JSON 본문을 파싱하는 미들웨어 추가
// 세션 미들웨어 설정

// 파일 기반 세션 스토어 경로
const sessionFilePath = path.join(__dirname, './models/sessions/sessions.json');
app.use(session({
  store: new SessionModel(sessionFilePath),
  secret: secretKey,//secretKey, // 실제로는 더 복잡한 비밀 키를 사용하세요.
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // HTTPS를 사용할 경우 true로 설정하세요.
}));

// 라우트 설정
const userRoutes =require( './routes/userRoutes.js');
const authRoutes =require( './routes/authRoutes.js');
const postRoutes =require( './routes/postRoutes.js');
const commentRoutes =require( './routes/commentRoutes.js');

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/auth', authRoutes);

// 서버 실행
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
