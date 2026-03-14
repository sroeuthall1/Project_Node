const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "tbl_telegram",
    {
      Tel_Id: {
        type: DataTypes.STRING(25),
        primaryKey: true,
        allowNull: false,
      },
        Token: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        Group_Id: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        Status: {
            type: DataTypes.STRING(25),
            allowNull: true
        },
      Is_Alert: {
          type: DataTypes.ENUM("0", "1"),
          allowNull: true
      },
    },
    {
      tableName: "tbl_telegram",
      timestamps: false,
     }
  );
