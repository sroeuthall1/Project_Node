const sequelize = require("../config/db");

const Brand = require("./Brand")(sequelize);
const Category = require("./Category")(sequelize);
const Customer = require("./Customer")(sequelize);
const GeneralSetting = require("./GeneralSetting")(sequelize);
const MasterProduct = require("./MasterProduct")(sequelize);
const Order = require("./Order")(sequelize);
const OrderItem = require("./OrderItem")(sequelize);
const PaymentMethod = require("./PaymentMethod")(sequelize);
const Sale = require("./Sale")(sequelize);
const SaleItemDetail = require("./SaleItemDetail")(sequelize);
const Setting = require("./Setting")(sequelize);
const StoreInfor = require("./StoreInfor")(sequelize);
const Telegram = require("./Telegram")(sequelize);
const User = require("./User")(sequelize);

// ===== Associations (correct/common direction) =====

// Category 1—N Brand
// Category 1—N Brand
Category.hasMany(Brand, { foreignKey: "Cate_Id" });
Brand.belongsTo(Category, { foreignKey: "Cate_Id" });

// Category 1—N Product
Category.hasMany(MasterProduct, { foreignKey: "Cate_Id" });
MasterProduct.belongsTo(Category, { foreignKey: "Cate_Id" });

// Brand 1—N Product
Brand.hasMany(MasterProduct, { foreignKey: "Brand_Id" });
MasterProduct.belongsTo(Brand, { foreignKey: "Brand_Id" });

// Telegram 1—N Product
Telegram.hasMany(MasterProduct, { foreignKey: "Tel_Id" });
MasterProduct.belongsTo(Telegram, { foreignKey: "Tel_Id" });

// Customer 1—N Order
Customer.hasMany(Order, { foreignKey: "customer_id" });
Order.belongsTo(Customer, { foreignKey: "customer_id" });

// Order 1—N OrderItem
Order.hasMany(OrderItem, { foreignKey: "order_id" });
OrderItem.belongsTo(Order, { foreignKey: "order_id" });

// Product 1—N OrderItem
MasterProduct.hasMany(OrderItem, { foreignKey: "prd_id", sourceKey: "Pro_Id" });
OrderItem.belongsTo(MasterProduct, { foreignKey: "prd_id", targetKey: "Pro_Id" });

// PaymentMethod 1—N Sale
PaymentMethod.hasMany(Sale, { foreignKey: "pay_method", sourceKey: "code" });
Sale.belongsTo(PaymentMethod, { foreignKey: "pay_method", targetKey: "code" });

// Sale 1—N SaleItemDetail
Sale.hasMany(SaleItemDetail, { foreignKey: "sale_id" });
SaleItemDetail.belongsTo(Sale, { foreignKey: "sale_id" });

// Product 1—N SaleItemDetail
MasterProduct.hasMany(SaleItemDetail, { foreignKey: "prd_id", sourceKey: "Pro_Id" });
SaleItemDetail.belongsTo(MasterProduct, { foreignKey: "prd_id", targetKey: "Pro_Id" });

module.exports = {
  sequelize,
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
  User,
};
