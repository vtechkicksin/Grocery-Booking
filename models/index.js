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
    // console.log("Error " + err);
  });

const db = {};
// db.User;
// db.GroceryItems;
// db.OrderItems;
// db.Orders;

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("./users.js")(sequelize, DataTypes);
db.GroceryItems = require("./groceryItem.js")(sequelize, DataTypes);
db.Orders = require("./order.js")(sequelize, DataTypes);
db.OrderItems = require("./orderItem.js")(sequelize, DataTypes);

db.sequelize.sync({ force: false }).then(() => {
  console.log("yes re-sync done!");
});

// Define associations
db.User.hasMany(db.Orders, { foreignKey: "user_id" });
db.Orders.belongsTo(db.User, { foreignKey: "user_id" });

db.Orders.hasMany(db.OrderItems, { foreignKey: "order_id" });
db.OrderItems.belongsTo(db.Orders, { foreignKey: "order_id" });

db.GroceryItems.hasMany(db.OrderItems, { foreignKey: "item_id" });
db.OrderItems.belongsTo(db.GroceryItems, { foreignKey: "item_id" });

module.exports = db;
