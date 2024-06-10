const fs =require('fs');
const path= require('path');
const comments= require('../models/comments/comments.js');
const {v4}=require('uuid');

// 특정 게시글의 댓글을 가져오는 메서드
function getCommentById(commentId) {
    return comments.find(comment => comment.id === commentId);
}

// 특정 게시글의 댓글을 가져오는 메서드
function getCommentByPostId(postId) {
    return comments.filter(comment => comment.post_id === postId);
}


// 댓글 추가 메서드
function addComment(newComment) {
    const commentId = v4(); // UUID 버전 4로 새로운 ID 생성
    const commentWithId = { ...newComment, id: commentId }; // 새로운 사용자 객체에 ID 추가
    comments.push(commentWithId);
    saveCommentsToFile(comments);
    return commentId;
}

//댓글 수정
function updateComment(commentId, newData) {
    const index = comments.findIndex(comment => comment.id === commentId);
    if (index !== -1) {
      comments[index] = { ...comments[index], ...newData };
      saveCommentsToFile(comments);
    }
    return comments[index];
}

// 댓글 데이터를 파일에 저장하는 함수
function saveCommentsToFile(comments) {
    //const __dirname = path.dirname(new URL(import.meta.url).pathname);
    const data = JSON.stringify(comments, null, 2);
    const filePath = path.resolve(__dirname, '../models/comments/comments.js'); // 절대 경로 설정
    fs.writeFileSync(filePath, `module.exports = ${data};`, 'utf8');
}

//댓글 삭제
function deleteComment(commentId) {
    let temp_comments = comments;
    temp_comments= temp_comments.filter(comment => comment.id !== commentId);
    saveCommentsToFile(temp_comments);
}

module.exports =  {
    getCommentById,
    getCommentByPostId,
    addComment,
    updateComment,
    deleteComment
};