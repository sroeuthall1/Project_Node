const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "tbl_general_setting",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        Stock_alert: {
            type: DataTypes.SMALLINT,
            allowNull: false
        },
        Qty_alert: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        remark: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        is_alert: {
            type: DataTypes.SMALLINT,
            allowNull: false,
            defaultValue: 0
        },
    },
      {
          tableName: "tbl_general_setting",
        timestamps: false
     }
  );
