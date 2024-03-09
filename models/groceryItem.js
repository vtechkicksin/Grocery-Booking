// Define GroceryItems model

module.exports = (sequelize, DataTypes) => {
  const GroceryItems = sequelize.define("groceryItems", {
    item_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    quantity_left: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  return GroceryItems;
};
