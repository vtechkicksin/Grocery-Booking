// Define GroceryItems model

module.exports = (sequelize, DataTypes) => {
  const GroceryItems = sequelize.define("groceryItems", {
    item_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity_left: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  return GroceryItems;
};
