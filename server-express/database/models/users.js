const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('uuid'),
      primaryKey: true
    },
    nickname: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: "nickname"
    },
    password: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(40),
      allowNull: false,
      unique: "email"
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true
    },
    profile_image: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,//Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'users',
    timestamps: false,  // 자동 생성되는 timestamps 필드를 사용하지 않음
    createdAt: 'created_at',  // createdAt 필드 이름을 created_at으로 변경
    updatedAt: 'updated_at',  // updatedAt 필드 이름을 updated_at으로 변경
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "nickname",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "nickname" },
        ]
      },
      {
        name: "email",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "email" },
        ]
      },
    ]
  });
};
