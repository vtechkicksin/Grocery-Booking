// Define User model

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("users", {
    user_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    roles: {
      type: DataTypes.ENUM("USER", "ADMIN"),
      allowNull: false,
    },
    //   roles: {
    //     type: DataTypes.STRING,
    //     allowNull: false
    //   }
  });

  return User;
};
