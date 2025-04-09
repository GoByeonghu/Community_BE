const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const RedisStore = require('connect-redis').default; //(session); // 이 부분을 수정해야 함
const redis = require('redis');
const cors = require('cors');
const { profileImageDirectory, postImageDirectory, secretKey, redis_secretKey } = require('./localsetting.js');
const { v4: uuidv4 } = require('uuid');

// Redis 클라이언트 설정(ACL 적용)
const RedisClient = redis.createClient({
  host: '127.0.0.1',
  port: 6379,
  password: redis_secretKey // 설정한 비밀번호
});

RedisClient.connect();

RedisClient.on("error", function(error) {
  console.error(`❗️ Redis Error: ${error}`)
 })

 RedisClient.on("ready", () => {
  console.log('✅ 💃 redis have ready !')
 })
 
 RedisClient.on("connect", () => {
  console.log('✅ 💃 connect redis success !')
 })


// 미들웨어 설정
// let corsOptions = {
//   origin: 'https://www.domain.com',
//   credentials: true
// }
// app.use(cors(corsOptions));
pp.use(cors()); // 모든 도메인 허용
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  genid: (req) => {
    return uuidv4(); // 세션 ID로 UUID 생성
  },
  store: new RedisStore({ client: RedisClient }),
  secret: secretKey,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // HTTPS를 사용할 경우 true
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/static', express.static('file_server'));

// 라우트 설정
const userRoutes =require( './routes/userRoutes.js');
const authRoutes =require( './routes/authRoutes.js');
const postRoutes =require( './routes/postRoutes.js');
const commentRoutes =require( './routes/commentRoutes.js');

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/auth', authRoutes);

// 서버 종료 시 Redis 클라이언트 닫기
process.on('SIGINT', () => {
  RedisClient.quit(() => {
    console.log('Redis client disconnected through app termination');
    process.exit(0);
  });
});

// 서버 실행
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
