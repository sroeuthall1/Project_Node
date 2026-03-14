const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "tbl_payment_method",
    {
      code: {
        type: DataTypes.STRING(20),
        primaryKey: true,
        allowNull: false
      },
      type: {
        type: DataTypes.STRING(250),
        allowNull: false
      },
      is_active: {
        type: DataTypes.SMALLINT,
        allowNull: false
      },
      fee: {
        type: DataTypes.DECIMAL(10),
        allowNull: false
      },
    },
    {
      tableName: "tbl_payment_method",
      timestamps: false,
     }
  );
