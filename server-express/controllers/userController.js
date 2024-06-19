const fs =require( 'fs');
const path  =require( 'path');
const { v4: uuidv4 } = require('uuid');
const {profileImageDirectory} =require( '../localsetting.js');
const db = require('../database/models');
const User = db.models.users;

// 모든 사용자를 가져오는 메서드
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 특정 ID를 가진 사용자를 가져오는 메서드
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.session.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 특정 id를 가진 사용자의 닉네임을 가져오는 함수
exports.getNicknameById = async (id) => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user.nickname;
  } catch (error) {
    throw new Error(error.message);
  }
};



// 사용자 추가 메서드
exports.addUser = async (userData) => {
  try {
    const { nickname, password, email, profile_image } = userData;
    const newUser = {
      id: uuidv4(),
      nickname,
      password,
      email,
      profile_image
    };
    const createdUser = await User.create(newUser);
    let result = createdUser.toJSON();
    delete result.id;
    delete result.password;

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

// 사용자 추가 메서드 (이미지 파일이 있는 경우)
exports.addUserWithImage = async (userData, imageFile) => {
  const { nickname, password, email } = userData;

  try {
    // 이미지 파일 저장 관련 로직
    const ext = path.extname(imageFile.originalname);
    const filename = uuidv4() + ext;
    const imagePath = path.join(profileImageDirectory, filename);

    // 이미지 파일을 지정된 경로에 저장
    fs.writeFileSync(imagePath, imageFile.buffer);

    const newUser = {
      id: uuidv4(),
      nickname,
      password,
      email,
      profile_image: imagePath, // 이미지 파일 이름을 데이터베이스에 저장
    };

    const createdUser = await User.create(newUser);
    let result = createdUser.toJSON();
    delete result.id;
    delete result.password;

    return result;
    //return createdUser; // 생성된 사용자의 ID 반환
  } catch (error) {
    throw new Error(error.message);
  }
};

// 사용자 업데이트 메서드 (이미지 파일이 없는 경우)
exports.updateUser = async (userID, userData) => {
  try {
    const id = userID;
    const { nickname, password, email } = userData;

    // 기존 사용자 정보 가져오기
    const user = await User.findByPk(id);
    if (!user) {ß
      return null;
    }
    // 필드별 업데이트 여부 확인
    const updatedUserData = {
      nickname: nickname || user.nickname,
      password: password || user.password,
      email: email || user.email,
      profile_image: user.profile_image, // 이미지는 변경되지 않음
    };

    const [updated] = await User.update(updatedUserData, { where: { id } });
    if (!updated) {
      throw new Error(error.message);
    }
    const updatedUser = await User.findByPk(id);
    let result = updatedUser.toJSON();
    delete result.id;
    delete result.password;

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

// 사용자 업데이트 메서드 (이미지 파일이 있는 경우)
exports.updateUserWithImage = async (userID, userData, newImageFile) => {
  const id  = userID;
  const { nickname, password, email } = userData;
  const imageFile = newImageFile;

  try {
    // 기존 사용자 정보 가져오기
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error(error.message);
    }

    let profile_image = user.profile_image;

    if (imageFile) {
      // 이미지 파일 저장 관련 로직
      const ext = path.extname(imageFile.originalname);
      const filename = id + ext;
      profile_image = path.join(profileImageDirectory, filename);

      // 이미지 파일을 지정된 경로에 저장
      fs.writeFileSync(profile_image, imageFile.buffer);
    }

    // 필드별 업데이트 여부 확인
    const updatedUserData = {
      nickname: nickname || user.nickname,
      password: password || user.password,
      email: email || user.email,
      profile_image, // 새 이미지가 있으면 업데이트, 없으면 기존 값 유지
    };
    console.log(updatedUserData);//////////////////////
    const [updated] = await User.update(updatedUserData, { where: { id } });

    if (!updated) {
      throw new Error(error.message);
    }

    const updatedUser = await User.findByPk(id);


    let result = updatedUser.toJSON();
    delete result.id;
    delete result.password;

    return result;

  } catch (error) {
    throw new Error(error.message);
  }
};

// 사용자 삭제 메서드
exports.deleteUser = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    
    if (!user) {
      return false;
    }

    const profileImagePath = user.profile_image;

    // 프로필 이미지 파일 삭제
    if (profileImagePath) {
      try {
        await fs.promises.unlink(path.resolve(profileImagePath));
      } catch (error) {
        console.error(`Failed to delete profile image file: ${profileImagePath}`, error);
      }
    }

    // 사용자 삭제
    const deleted = await User.destroy({ where: { id: userId } });

    if (!deleted) {
      return false;
    }

    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};