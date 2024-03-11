// Define OrderItems model

module.exports = (sequelize, DataTypes) => {
  const OrderItems = sequelize.define("OrderItems", {
    order_item_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    order_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    item_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  return OrderItems;
};
