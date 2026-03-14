const sequelize = require("./db");
const {
  User,
  Brand,
  Category,
  Customer,
  GeneralSetting,
  MasterProduct,
  Order,
  OrderItem,
  PaymentMethod,
  Sale,
  SaleItemDetail,
  Setting,
  StoreInfor,
  Telegram,
} = require("../models");

const migrate = async () => {
  await sequelize.sync({ alter: true });
  console.log("Database migrated successfully!");
  process.exit(0);
};


module.exports = migrate;

if (require.main === module) {
  migrate().catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
  });
}
