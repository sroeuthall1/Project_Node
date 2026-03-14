const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "tbl_user",
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      username: {
        type: DataTypes.STRING(250),
        allowNull: false
      },
      email: {
        type: DataTypes.STRING(200),
        allowNull: false
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      status: {
        type: DataTypes.STRING(6),
        allowNull: false
      },
      otp_code: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      otp_expires_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
    },
    {
      tableName: "tbl_user",
      timestamps: false,
     }
  );
