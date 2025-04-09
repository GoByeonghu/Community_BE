const { v4 } = require('uuid');
const db = require('../database/models');
const User = db.models.users;
const Posts = db.models.posts;
const Comment = db.models.comments;

// 특정 댓글을 가져오는 메서드
async function getCommentById(commentId) {
  return await Comment.findByPk(commentId);
}

// 특정 게시글의 댓글을 가져오는 메서드
async function getCommentByPostId(postId) {
  return await Comment.findAll({ where: { post_id: postId } });
}

async function getCommentByPostIdWithoutUserId(postId) {
    try {
      const comments = await Comment.findAll({
        where: { post_id: postId },
        include: [
          {
            model: User,
            attributes: ['nickname'],
            as: 'user', // User 모델을 'user'라는 별칭으로 지정
          },
        ],
        attributes: {
          exclude: ['user_id'], // user_id 필드 제외
        },
      });
  
      // 결과 포맷 변환
      const formattedComments = comments.map(comment => {
        const commentData = comment.toJSON();
        commentData.nickname = comment.user ? comment.user.nickname : null; // user_id에 해당하는 사용자의 nickname 가져오기
        delete commentData.user;
        return commentData;
      });
  
      return formattedComments;
    } catch (error) {
      throw new Error(error.message);
    }
  }

// 댓글 추가 메서드
async function addComment(newComment) {
    const comment = await Comment.create(newComment);
    return comment.id;
}

// 댓글 수정 메서드
async function updateComment(commentId, newData) {
  const comment = await Comment.findByPk(commentId);
  if (comment) {
    await comment.update(newData);
  }
  return comment;
}

// 댓글 삭제 메서드
async function deleteComment(commentId) {
  const comment = await Comment.findByPk(commentId);
  if (comment) {
    await comment.destroy();
  }
}

module.exports = {
  getCommentById,
  getCommentByPostId,
  getCommentByPostIdWithoutUserId,
  addComment,
  updateComment,
  deleteComment
};