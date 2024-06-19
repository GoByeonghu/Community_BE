const fs = require('fs');
const path = require('path');
const { v4 } = require('uuid');
const db = require('../database/models');
const Post = db.models.posts;
const User = db.models.users;
const { postImageDirectory } = require('../localsetting.js');

// 모든 게시글을 가져오는 메서드
async function getAllPosts() {
  return await Post.findAll();
}

// 모든 게시글을 가져오되 id대신 닉네임을 반환하는 메서드
async function getAllPostsWithNickname() {
  try {
    // 게시물 조회
    const posts = await Post.findAll({
      include: {
        model: User,
        attributes: ['nickname'],
        as: 'user', // 게시물과 사용자 모델의 관계가 정의되어 있어야 합니다.
      },
    });

    // 게시물 객체에서 user_id 필드 제외하고 nickname 값만 추출하여 새로운 배열로 반환
    const formattedPosts = posts.map(post => ({
      id: post.id, // 게시물의 다른 필드들
      title: post.title,
      image: post.image,
      nickname: post.user.nickname,
      content: post.content,
      deadline : post.deadline,
      created_at: post.created_at,
      updated_at: post.updated_at,
      like_count: post.like_count,
      dislike_count: post.dislike_count
    }));

    return formattedPosts;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function getPostById(postId) {
  // 게시물과 관련된 사용자의 nickname을 포함하여 조회
  const post = await Post.findByPk(postId, {
    include: {
      model: User,
      attributes: ['nickname'], // nickname 필드만 가져옴
      as: 'user', // 관계의 별칭이 'user'라고 가정
    },
  });

  if (!post) {
    return null;
  }

  // JSON으로 변환하고 user_id 필드를 제거한 후 nickname 필드를 추가
  const postJSON = post.toJSON();
  postJSON.nickname = post.user.nickname; // nickname 필드 추가
  delete postJSON.user_id; // user_id 필드 제거
  delete postJSON.user; // user 객체 제거

  return postJSON;
}

function saveImage(postId, imageFile) {
  const imageName = `${postId}.jpg`; // 이미지 파일명을 postId.jpg로 설정
  const postDirectory = postImageDirectory;//path.join(postImageDirectory, postId); // 게시글 디렉토리 경로 설정
  const imagePath = path.join(postDirectory, imageName); // 이미지 저장 경로 설정

  // 게시글 디렉토리 생성 (존재하지 않는 경우에만)
  if (!fs.existsSync(postDirectory)) {
    fs.mkdirSync(postDirectory, { recursive: true }); // 재귀적으로 디렉토리 생성
  }

  // 이미지 파일을 버퍼로 저장
  fs.writeFileSync(imagePath, imageFile.buffer);
  return imagePath;
}

// 게시글 추가 메서드
async function addPost(newPost) {
  
  const post = await Post.create(newPost);
  return post.id;
}

async function addPostWithImage(newPost, imageFile) {
  //console.log(newPost);
  const imagePath = saveImage(v4(), imageFile); // 이미지 저장 및 파일명 가져오기
  newPost.image = imagePath;
  const post = await Post.create(newPost);
  console.log(post);
  return post.id;
}

// 게시글 삭제 메서드
async function deletePost(postId) {
  const post = await Post.findByPk(postId);
  if (post) {
    const imagePath = post.image;

    // 이미지 파일 삭제
    if (imagePath) {
      try {
        await fs.promises.unlink(path.resolve(imagePath));
      } catch (error) {
        console.error(`Failed to delete image file: ${imagePath}`, error);
      }
    }

    // 게시글 삭제
    await post.destroy();
  }
}

// 게시글 업데이트 메서드
async function updatePost(postId, newData) {
  const post = await Post.findByPk(postId, {
    include: {
      model: User,
      attributes: ['nickname'], // nickname 필드만 가져옴
      as: 'user', // 관계의 별칭이 'user'라고 가정
    },
  });

  if (post) {
    await post.update(newData);

    // JSON으로 변환하고 user_id 필드를 제거한 후 nickname 필드를 추가
    const postJSON = post.toJSON();
    postJSON.nickname = post.user.nickname; // nickname 필드 추가
    delete postJSON.user_id; // user_id 필드 제거
    delete postJSON.user; // user 객체 제거

    return postJSON;
  } else {
    return null;
  }
}

async function updatePostWithImage(postId, newData, imageFile) {
  const post = await Post.findByPk(postId, {
    include: {
      model: User,
      attributes: ['nickname'], // nickname 필드만 가져옴
      as: 'user', // 관계의 별칭이 'user'라고 가정
    },
  });

  if (post) {
    const imageName = saveImage(postId, imageFile); // 이미지 저장 및 파일명 가져오기
    newData.image = imageName;
    await post.update(newData);

    // JSON으로 변환하고 user_id 필드를 제거한 후 nickname 필드를 추가
    const postJSON = post.toJSON();
    postJSON.nickname = post.user.nickname; // nickname 필드 추가
    delete postJSON.user_id; // user_id 필드 제거
    delete postJSON.user; // user 객체 제거

    return postJSON;
  } else {
    return null;
  }
}

module.exports = {
  getAllPosts,
  getAllPostsWithNickname,
  getPostById,
  addPost,
  addPostWithImage,
  deletePost,
  updatePost,
  updatePostWithImage,
};
