// postRouter.js
const express = require('express');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();
const postControl = require('../controllers/postController.js');
const { checkLoginStatus, checkUserOwnership } = require('../controllers/authController');

// JSON 요청을 파싱하여 req.body에 저장
router.use(express.json());

// GET /api/posts
router.get('/', async (req, res) => {
  try {
    const posts = await postControl.getAllPostsWithNickname(); //getAllPosts();
    res.json({ 'message': 'ok', 'data': { 'post_list': posts } });
  } catch (error) {
    res.status(500).json({ 'message': 'Error retrieving posts', 'error': error.message });
  }
});



// POST /api/posts
router.post('/', checkLoginStatus, upload.single('feed_image'), async (req, res) => {
  try {
    const newPost = JSON.parse(req.body.postData); // 게시글 정보
    const imageFile = req.file; // 이미지 파일 여부 확인

    // 필드가 존재하지 않으면 기본값으로 설정
    newPost.user_id = req.user.id;
    newPost.created_at = newPost.created_at || new Date().toISOString(); // 현재 시간
    newPost.good_num = newPost.good_num || 0;
    newPost.comment_num = newPost.comment_num || 0;
    newPost.view_num = newPost.view_num || 0;
    const dead_line = new Date();
    dead_line.setDate(dead_line.getDate() + 1);
    newPost.deadline = newPost.deadline || dead_line; // 현재 시간 기준 하루 뒤

    let postID;
    if (imageFile) {
      // 이미지 파일이 있는 경우
      postID = await postControl.addPostWithImage(newPost, imageFile);
    } else {
      // 이미지 파일이 없는 경우
      postID = await postControl.addPost(newPost);
    }

    res.status(201).json({
      'message': 'Create successfully',
      'data': {
        'post_id': postID
      }
    });
  } catch (error) {
    res.status(500).json({ 'message': 'Error creating post', 'error': error.message });
  }
});

// GET /api/posts/:id
router.get('/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await postControl.getPostById(postId);
    if (!post) {
      return res.status(404).json({ message: 'non-existent post', data: null });
    }

    // 모델 인스턴스를 JSON 객체로 변환
    //const postJSON = post.toJSON();
    //delete postJSON.user_id;
    res.json({ 'message': 'ok', 'data': post });
  } catch (error) {
    res.status(500).json({ 'message': 'Error retrieving post', 'error': error.message });
  }
});

// PUT /api/posts/:id - 특정 게시글 수정
router.put('/:id', upload.single('feed_image'), async (req, res) => {
  try {
    const postId = req.params.id;
    const newData = JSON.parse(req.body.postData); // 게시글 정보
    const imageFile = req.file; // 이미지 파일 여부 확인
    let updatedPost;

    if (imageFile) {
      // 이미지 파일이 있는 경우
      updatedPost = await postControl.updatePostWithImage(postId, newData, imageFile);
    } else {
      // 이미지 파일이 없는 경우
      updatedPost = await postControl.updatePost(postId, newData);
    }

    res.status(201).json({
      'message': 'Update success',
      'data': updatedPost
    });
  } catch (error) {
    res.status(500).json({ 'message': 'Error updating post', 'error': error.message });
  }
});

// DELETE /api/posts/:id - 특정 게시글 삭제
router.delete('/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    await postControl.deletePost(postId); // postControl에서 특정 게시글을 삭제합니다.
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ 'message': 'Error deleting post', 'error': error.message });
  }
});

module.exports = router;
