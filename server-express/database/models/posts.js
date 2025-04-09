const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('posts', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true // 자동 증가하는 정수 타입 필드
    },
    user_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      references: {
        model: 'users', // 참조할 테이블 이름
        key: 'id' // 참조할 테이블의 기본 키
      }
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: false
    },
    like_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    dislike_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'posts',
    timestamps: true, // createdAt과 updatedAt 자동 생성
    createdAt: 'created_at', // updatedAt 필드 이름을 updated_at으로 변경
    updatedAt: 'updated_at', // updatedAt 필드 이름을 updated_at으로 변경
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" }
        ]
      },
      {
        name: "posts_user_id",
        using: "BTREE",
        fields: [
          { name: "user_id" }
        ]
      }
    ]
  });
};

// const Sequelize = require('sequelize');
// module.exports = function(sequelize, DataTypes) {
//   return sequelize.define('posts', {
//     id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       primaryKey: true
//     },
//     user_id: {
//       type: DataTypes.STRING(36),
//       allowNull: false,
//       references: {
//         model: 'users',
//         key: 'id'
//       }
//     },
//     title: {
//       type: DataTypes.TEXT,
//       allowNull: true
//     },
//     image: {
//       type: DataTypes.TEXT,
//       allowNull: true
//     },
//     content: {
//       type: DataTypes.TEXT,
//       allowNull: true
//     },
//     deadline: {
//       type: DataTypes.DATE,
//       allowNull: false
//     },
//     like_count: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       defaultValue: 0
//     },
//     dislike_count: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       defaultValue: 0
//     }
//   }, {
//     sequelize,
//     tableName: 'posts',
//     timestamps: true,
//     indexes: [
//       {
//         name: "PRIMARY",
//         unique: true,
//         using: "BTREE",
//         fields: [
//           { name: "id" },
//         ]
//       },
//       {
//         name: "posts_user_id",
//         using: "BTREE",
//         fields: [
//           { name: "user_id" },
//         ]
//       },
//     ]
//   });
// };
