const dbConfig = require("../config/dbConfig.js");

const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("connected...");
  })
  .catch((err) => {
    console.log("Error " + err);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.USER;
db.GroceryItems;
db.OrderItems;
db.Orders;

const User = require("./users.js")(sequelize, DataTypes);
const GroceryItems = require("./groceryItem.js")(sequelize, DataTypes);
const Orders = require("./order.js")(sequelize, DataTypes);
const OrderItems = require("./orderItem.js")(sequelize, DataTypes);

// Define associations
User.hasMany(Orders, { foreignKey: "user_id" });
Orders.belongsTo(User, { foreignKey: "user_id" });

Orders.hasMany(OrderItems, { foreignKey: "order_id" });
OrderItems.belongsTo(Orders, { foreignKey: "order_id" });

GroceryItems.hasMany(OrderItems, { foreignKey: "item_id" });
OrderItems.belongsTo(GroceryItems, { foreignKey: "item_id" });

db.sequelize.sync({ force: false }).then(() => {
  console.log("yes re-sync done!");
});

module.exports = db;
