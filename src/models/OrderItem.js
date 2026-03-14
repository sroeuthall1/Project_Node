const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "tbl_order_item",
    {
        order_item_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
      order_id: {
          type: DataTypes.STRING(50),
          allowNull: true
      },
      prd_id: {
          type: DataTypes.STRING(25),
          allowNull: true
      },
      unit_price: {
          type: DataTypes.DOUBLE,
          allowNull: true
      },
      qty: {
          type: DataTypes.DOUBLE,
          allowNull: true
      },
    },
      {
          tableName: "tbl_order_item",
        timestamps: false,
     }
  );
