const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "tbl_category",
    {
        Cate_Id: {
            type: DataTypes.STRING(25), primaryKey: true,
            allowNull: false
        },
        Cate_Name: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        Description: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
    },
      {
        tableName: "tbl_category",
        timestamps: false,
      }
  );
