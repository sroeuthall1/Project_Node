const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "tbl_master_product",
    {
      Pro_Id: {
        type: DataTypes.STRING(25),
        primaryKey: true,
        allowNull: false
      },
      Pro_Name: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      Cate_Id: {
        type: DataTypes.STRING(25),
        allowNull: true
      },
      Brand_Id: {
        type: DataTypes.STRING(25),
        allowNull: true
      },
      Stock_Date: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      Exp_Date: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      Qty: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      Unit_Cost: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      Tel_Id: {
        type: DataTypes.STRING(25),
        allowNull: true
      },
      Status: {
        type: DataTypes.ENUM("low", "avaible", "unvaible"),
        allowNull: true
      },
      Remark: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      Photo: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
    },
    {
      tableName: "tbl_master_product",
      timestamps: false
     }
  );
