const fs =require( 'fs');
const path  =require( 'path');
const users =require( '../models/users/users.js');
const {profileImageDirectory} =require( '../localsetting.js');
const {v4} =require( 'uuid'); // UUID 버전 4 모듈 가져오기

// 모든 사용자를 가져오는 메서드
function getAllUsers() {
  return users.slice(); // 복사본을 반환하여 원본 데이터가 수정되지 않도록 합니다.
}

// 특정 ID를 가진 사용자를 가져오는 메서드
function getUserById(userId) {
  return users.find(user => user.id === userId);
}

// 사용자 추가 메서드
function addUser(newUser) {
  const userId = v4(); // UUID 버전 4로 새로운 ID 생성
  const userWithId = { ...newUser, id: userId }; // 새로운 사용자 객체에 ID 추가
  users.push(userWithId);
  saveUsersToFile(users);
  return userId;
}

function addUserWithImage(newUser, imageFile) {
  const userId = v4(); // UUID 버전 4로 새로운 ID 생성
  const userWithId = { ...newUser, id: userId }; // 새로운 사용자 객체에 ID 추가
  const imageName = saveImage(userId, imageFile); // 이미지 저장 및 파일명 가져오기
  userWithId.image = imageName; // 사용자 객체에 이미지 파일명 추가
  users.push(userWithId); // 사용자 추가
  saveUsersToFile(users); // 사용자 정보를 파일에 저장
  return userId;
}

// 사용자 수정 메서드
function updateUser(userId, newData) {
  const index = users.findIndex(user => user.id === userId);
  if (index !== -1) {
    users[index] = { ...users[index], ...newData };
    saveUsersToFile(users);
  }
  return users[index];
}

function updateUserWithImage(userId, newData, imageFile) {
  const index = users.findIndex(user => user.id === userId);
  if (index !== -1) {
    const imageName = saveImage(userId, imageFile); // 이미지 저장 및 파일명 가져오기
    users[index] = { ...users[index], ...newData, image: imageName };
    saveUsersToFile(users);
    return users[index];
  }
}

// 사용자 삭제 메서드
function deleteUser(userId) {
  let temp_users = users;
  temp_users = temp_users.filter(user => user.id !== userId);
  saveUsersToFile(temp_users);
}

// 사용자 데이터를 파일에 저장하는 함수
function saveUsersToFile(users) {
  //const __dirname = path.dirname(new URL(import.meta.url).pathname);
  const data = JSON.stringify(users, null, 2);
  const filePath = path.resolve(__dirname, '../models/users/users.js'); // 절대 경로 설정
  fs.writeFileSync(filePath, `module.exports = ${data};`, 'utf8');

}

function saveImage(userId, imageFile) {
  const imageName = `${userId}.jpg`; // 이미지 파일명을 userId.jpg로 설정
  const userDirectory = path.join(profileImageDirectory, userId); // 사용자 디렉토리 경로 설정
  const imagePath = path.join(userDirectory, imageName); // 이미지 저장 경로 설정

  // 사용자 디렉토리 생성 (존재하지 않는 경우에만)
  if (!fs.existsSync(userDirectory)) {
    fs.mkdirSync(userDirectory, { recursive: true }); // 재귀적으로 디렉토리 생성
  }

  // 이미지 파일을 버퍼로 저장
  fs.writeFile(imagePath, imageFile.buffer, (err) => {
    if (err) {
      console.error('Error saving image:', err);
    }
  });

  return imageName; // 저장된 이미지 파일명 반환
}


module.exports = {
  getAllUsers: getAllUsers,
  getUserById: getUserById,
  addUser: addUser,
  addUserWithImage: addUserWithImage,
  updateUser: updateUser,
  deleteUser: deleteUser,
  updateUserWithImage: updateUserWithImage
};