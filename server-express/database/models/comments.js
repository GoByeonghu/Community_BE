const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('comments', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true // 자동 증가하는 정수 타입 필드
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'posts', // 참조할 테이블 이름
        key: 'id' // 참조할 테이블의 기본 키
      }
    },
    user_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      references: {
        model: 'users', // 참조할 테이블 이름
        key: 'id' // 참조할 테이블의 기본 키
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'comments',
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
        name: "comments_post_id",
        using: "BTREE",
        fields: [
          { name: "post_id" }
        ]
      },
      {
        name: "user_id",
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
//   return sequelize.define('comments', {
//     id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       primaryKey: true
//     },
//     post_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: 'posts',
//         key: 'id'
//       }
//     },
//     user_id: {
//       type: DataTypes.STRING(36),
//       allowNull: false,
//       references: {
//         model: 'users',
//         key: 'id'
//       }
//     },
//     content: {
//       type: DataTypes.TEXT,
//       allowNull: false
//     }
//   }, {
//     sequelize,
//     tableName: 'comments',
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
//         name: "comments_post_id",
//         using: "BTREE",
//         fields: [
//           { name: "post_id" },
//         ]
//       },
//       {
//         name: "user_id",
//         using: "BTREE",
//         fields: [
//           { name: "user_id" },
//         ]
//       },
//     ]
//   });
// };
