const fs = require( 'fs');
const path  = require( 'path');
const posts = require( '../models/posts/posts.js');
const {postImageDirectory} = require( '../localsetting.js');
const {v4} = require( 'uuid'); // UUID 버전 4 모듈 가져오기

// 모든 게시글을 가져오는 메서드
function getAllPosts() {
  return posts.slice(); // 복사본을 반환하여 원본 데이터가 수정되지 않도록 합니다.
}

// 특정 ID를 가진 게시글을 가져오는 메서드
function getPostById(postId) {
  return posts.find(post => post.id === postId);
}

// 사용자 데이터를 파일에 저장하는 함수
function savePostsToFile(posts) {
    //const __dirname = path.dirname(new URL(import.meta.url).pathname);
    const data = JSON.stringify(posts, null, 2);
    const filePath = path.resolve(__dirname, '../models/posts/posts.js'); // 절대 경로 설정
    fs.writeFileSync(filePath, `module.exports =  ${data};`, 'utf8');
}
  
  function saveImage(postId, imageFile) {
    const imageName = `${postId}.jpg`; // 이미지 파일명을 userId.jpg로 설정
    const postDirectory = path.join(postImageDirectory, postId); // 사용자 디렉토리 경로 설정
    const imagePath = path.join(postDirectory, imageName); // 이미지 저장 경로 설정
  
    // 사용자 디렉토리 생성 (존재하지 않는 경우에만)
    if (!fs.existsSync(postDirectory)) {
      fs.mkdirSync(postDirectory, { recursive: true }); // 재귀적으로 디렉토리 생성
    }
  
    // 이미지 파일을 버퍼로 저장
    fs.writeFile(imagePath, imageFile.buffer, (err) => {
      if (err) {
        console.error('Error saving image:', err);
      }
    });
  
    return imageName;
  }

// 게시글 추가 메서드
function addPost(newPost) {
    const postId = v4(); // UUID 버전 4로 새로운 ID 생성
    const postWithId = { ...newPost, id: postId }; // 새로운 사용자 객체에 ID 추가
    posts.push(postWithId);
    savePostsToFile(posts);
    return postId;
  }
  
  function addPostWithImage(newPost, imageFile) {
    const postId = v4(); // UUID 버전 4로 새로운 ID 생성
    const postWithId = { ...newPost, id: postId }; // 새로운 사용자 객체에 ID 추가
    const imageName = saveImage(postId, imageFile); // 이미지 저장 및 파일명 가져오기
    postWithId.image = imageName; // 사용자 객체에 이미지 파일명 추가
    posts.push(postWithId); // 사용자 추가
    savePostsToFile(posts); // 사용자 정보를 파일에 저장
    return postId;
  }

  // 게시글 삭제 메서드
function deletePost(postId) {
    let temp_posts = posts;
    temp_posts = temp_posts.filter(post => post.id !== postId);
    savePostsToFile(temp_posts);
  }


  function updatePost(postId, newData) {
    const index = posts.findIndex(post => post.id === postId);
    if (index !== -1) {
      posts[index] = { ...posts[index], ...newData };
      savePostsToFile(posts);
    }
    return posts[index];
  }

  function updatePostWithImage(postId, newData, imageFile){
    const index = posts.findIndex(post => post.id === postId);
    if (index !== -1) {
        const imageName = saveImage(postId, imageFile); // 이미지 저장 및 파일명 가져오기
        posts[index] = { ...posts[index], ...newData, image: imageName };
        savePostsToFile(posts);
    }
    return posts[index];
  }


  module.exports =  {
  getAllPosts,
  getPostById,
  addPost,
  addPostWithImage,
  deletePost,
  updatePost,
  updatePostWithImage
};