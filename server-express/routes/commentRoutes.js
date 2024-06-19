// commentRouter.js
const express = require('express');
const router = express.Router();
const commentControl = require('../controllers/commentController.js');
const { checkLoginStatus} = require('../controllers/authController');

// JSON 요청을 파싱하여 req.body에 저장
router.use(express.json());

// GET /api/comments
router.get('/', checkLoginStatus, async (req, res) => {
  try {
    const postId = req.query.post_id;
    const comments = await commentControl.getCommentByPostIdWithoutUserId(postId);//getCommentByPostId(postId);
    res.json({ 'message': 'ok', 'data': { 'post_id': postId, 'comments_list': comments } });
  } catch (error) {
    res.status(500).json({ 'message': 'Error retrieving comments', 'error': error.message });
  }
});

// POST /api/comments
router.post('/', checkLoginStatus, async (req, res) => {
  try {
    let newComment = req.body; // 사용자 정보

    // 필드가 존재하지 않으면 기본값으로 설정
    newComment.created_at = newComment.created_at || new Date().toISOString(); // 현재 시간
    newComment.user_id = req.user.id;
    
    const commentID = await commentControl.addComment(newComment);
    let createdComment = await commentControl.getCommentById(commentID);
    
    let result = createdComment.toJSON();
    delete result.user_id;
    result.nickname=req.user.nickname;
    res.status(201).json({
      'message': 'Create successfully',
      'data': result
    });
  } catch (error) {
    res.status(500).json({ 'message': 'Error creating comment', 'error': error.message });
  }
});

// PUT /api/comments/:id - 특정 댓글 수정
router.put('/:id', checkLoginStatus, async (req, res) => {
  try {
    const commentId = req.params.id;
    const newData = req.body; // 사용자 정보

    let updatedComment = await commentControl.updateComment(commentId, newData);

    let result = updatedComment.toJSON();
    delete result.user_id;
    result.nickname=req.user.nickname;

    res.status(201).json({
      'message': 'Update success',
      'data': result
    });
  } catch (error) {
    res.status(500).json({ 'message': 'Error updating comment', 'error': error.message });
  }
});

// DELETE /api/comments/:id - 특정 댓글 삭제
router.delete('/:id',checkLoginStatus, async (req, res) => {
  try {
    const commentId = req.params.id;
    await commentControl.deleteComment(commentId);
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ 'message': 'Error deleting comment', 'error': error.message });
  }
});

module.exports = router;
