const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "tbl_brand",
    {
        Brand_Id: {
            type: DataTypes.STRING(25), primaryKey: true,
            allowNull: false
        },
      Brand_Name: {
          type: DataTypes.STRING(50),
          allowNull: true
      },
      Cate_Id: {
          type: DataTypes.STRING(25),
          allowNull: true
      },
      Description: {
          type: DataTypes.STRING(100),
          allowNull: true
      },
    },
    {
      tableName: "tbl_brand",
      timestamps: false
    }
  );
