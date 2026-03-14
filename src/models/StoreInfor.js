const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "tbl_store_infor",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      store_name: {
        type: DataTypes.STRING(250),
        allowNull: false
      },
      email: {
        type: DataTypes.STRING(250),
        allowNull: true
      },
      website: {
        type: DataTypes.STRING(250),
        allowNull: true
      },
      logo: {
        type: DataTypes.TEXT,
        allowNull: true
      },
    },
    {
      tableName: "tbl_store_infor",
      timestamps: false,
     }
  );
