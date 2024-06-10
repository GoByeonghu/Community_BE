// userRouter.js
const express =require( 'express');
const router = express.Router();
const postControl =require( '../controllers/postController.js');
const commentControl =require( '../controllers/commentController.js');

// JSON 요청을 파싱하여 req.body에 저장
router.use(express.json());

// GET /api/comments
router.get('/', (req, res) => {
  const postId = req.query.post_id;
  const comments = commentControl.getCommentByPostId(postId);
  res.json({'message' : 'ok' , 'data' : { 'post_id' : postId ,'comments_list' : comments}});
});

// POST /api/comments
router.post('/', (req, res) => {
  const newComment = req.body;//JSON.parse(req.body); // 사용자 정보
  let commentID;

  // 필드가 존재하지 않으면 기본값으로 설정
  newComment.create_at = newComment.create_at || new Date().toISOString(); // 현재 시간
  //ToDo 인가 이후 유저아이디도 설정해야함
  commentID=commentControl.addComment(newComment);
  result = commentControl.getCommentById(commentID);

  res.status(201).json(
    {
    'message' : 'Create successfully',
    'data' : result
    }
  );
});

// PUT /api/comments/:id - 특정 사용자 수정
router.put('/:id',  (req, res) => {
  const commentId = req.params.id;
  const newData = req.body; // 사용자 정보
  let updatedComment;
  updatedComment=commentControl.updateComment(commentId, newData);

  res.status(201).json(
    {
    'message' : 'update success',
    'data' : updatedComment
    }
  );
});

// DELETE /api/comments/:id - 특정 게시글 삭제
router.delete('/:id', (req, res) => {
  const commentId = req.params.id;
  commentControl.deleteComment(commentId);
  res.json({ message: 'Comment deleted successfully' });
});

module.exports =router;