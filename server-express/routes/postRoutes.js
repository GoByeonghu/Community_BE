// userRouter.js
const express =require( 'express');
const multer =require( 'multer');
const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();
const postControl =require( '../controllers/postController.js');

// JSON 요청을 파싱하여 req.body에 저장
router.use(express.json());

// GET /api/posts
router.get('/', (req, res) => {
  const posts = postControl.getAllPosts();
  res.json({'message' : 'ok' , 'data' : { 'post_list' : posts}});
});

// POST /api/posts
router.post('/',  upload.single('feed_image'), (req, res) => {
  const newPost = JSON.parse(req.body.postData); // 사용자 정보
  const imageFile = req.file; // 이미지 파일 여부 확인
  let postID;

  // 필드가 존재하지 않으면 기본값으로 설정
  newPost.create_at = newPost.created_at || new Date().toISOString(); // 현재 시간
  newPost.good_num = newPost.good_num || 0;
  newPost.comment_num = newPost.comment_num || 0;
  newPost.view_num = newPost.view_num || 0;
  //ToDo 인가 이후 유저아이디도 설정해야함

  if (imageFile) {
    // 이미지 파일이 있는 경우
    postID=postControl.addPostWithImage(newPost, imageFile);
  } else {
    // 이미지 파일이 없는 경우
    postID=postControl.addPost(newPost);
  }

  res.status(201).json(
    {
    'message' : 'Create successfully',
    'data' : {
      'post_id' : postID
      }
    }
  );

});

// GET /api/posts/:id
router.get('/:id', (req, res) => {
  const postId = req.params.id;
  const post = postControl.getPostById(postId);
  if (!post) {
    return res.status(404).json({ message: 'non-existent user', data : null });
  }
  delete post.password;
  res.json({'message':'ok','data':post});
});

// PUT /api/posts/:id - 특정 사용자 수정
router.put('/:id', upload.single('feed_image'), (req, res) => {
  const postId = req.params.id;
  const newData = JSON.parse(req.body.postData); // 사용자 정보
  const imageFile = req.file; // 이미지 파일 여부 확인
  let updatedPost;

  if (imageFile) {
    // 이미지 파일이 있는 경우
    updatedPost=postControl.updatePostWithImage(postId, newData, imageFile);
  } else {
    // 이미지 파일이 없는 경우
    updatedPost=postControl.updatePost(postId, newData);
  }

  res.status(201).json(
    {
    'message' : 'update success',
    'data' : updatedPost
    }
  );
});

// DELETE /api/posts/:id - 특정 게시글 삭제
router.delete('/:id', (req, res) => {
  const postId = req.params.id;
  postControl.deletePost(postId); // userControl에서 특정 사용자를 삭제합니다.
  res.json({ message: 'Post deleted successfully' });
});

module.exports =router;