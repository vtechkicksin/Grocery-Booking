const db = require("../models");
const dbConfig = require("../config/dbConfig");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { sign } = require("jsonwebtoken");

class Grocery {
  static async registerApi(req, res) {
    try {
      const { name, email, password, passwordConfirm } = req.body;

      if (password != passwordConfirm) {
        return res.json({
          message: "Password do not matched",
        });
      }
      let userId = crypto.randomUUID();
      const data = await db.User.findOne({
        where: {
          email: email,
        },
        attributes: ["email"],
      });

      if (data != null) {
        return res.json({
          message: "Already existing email",
        });
      }
      let hashPassword = await bcrypt.hash(password, 8);
      await db.User.create({
        user_id: userId,
        username: name,
        email: email,
        password: hashPassword,
        roles: "user",
      });
      return res.send({
        message: "User Register",
      });
    } catch (error) {
      console.log(error);
      console.error(error);
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      console.log("req.body", req.body);

      const data = await db.User.findOne({
        where: {
          email: email,
        },
        // attributes: ["password"],
      });
      console.log("data>>>>", data.dataValues);
      if (data != null) {
        const result = bcrypt.compareSync(password, data.dataValues.password);
        if (result) {
          const jsontoken = sign(
            {
              userId: data.dataValues.user_id,
              email: email,
              roles: data.dataValues.roles,
            },
            process.env.SECRET_KEY,
            {
              expiresIn: "1day",
            }
          );
          return res.json({
            success: 1,
            message: "login Successfully",
            token: jsontoken,
          });
        }
      }
      return res.send({
        message: "User Not Found you need to register before login",
      });
    } catch (error) {
      console.log(error);
      console.error(error);
    }
  }
  static async changeRoles(req, res) {
    try {
      const { superAdmin, emailToChange, rolesToChange } = req.body;
      const superId = dbConfig.superAdmin.email;
      if (superAdmin !== superId) {
        res.json({
          message: "SuperAdmin email did not match",
        });
      }
      const data = await db.User.findOne({
        where: {
          email: emailToChange,
        },
      });
      if (data === null) {
        res.json({
          message: "User Not Found Please Register your user",
        });
      }
      if (rolesToChange.toLowerCase() === data.dataValues.roles.toLowerCase()) {
        res.json({
          message: "User Already have the requested role",
        });
      }
      await db.User.update(
        {
          roles: rolesToChange.toUpperCase(),
        },
        {
          where: {
            email: emailToChange,
          },
        }
      );

      res.json({
        message:"Role changed to Admin successfully"
      })
    } catch (error) {
      console.log(error);
      console.error(error);
    }
  }
  static async addNewGrocery(req, res) {
    try {
      const arr = req.body;
      const jsonString = JSON.stringify(arr);
      const parsedArray = JSON.parse(jsonString);
      console.log("array from request", arr);
      for (let i = 0; i < parsedArray.length; i++) {
        let userId = crypto.randomUUID();
        parsedArray[i].item_id = userId;
      }
      console.log("parsedArray>>>>>>>", parsedArray);
      await db.GroceryItems.bulkCreate(parsedArray);
      return res.send({
        message: "Grocery is updated",
      });
    } catch (error) {
      console.log(error);
      console.error(error);
    }
  }
  static async removeGroceryItem(req, res) {
    try {
      const arr = req.body;
      console.log("arr>>>>>", arr);
      const data = await db.GroceryItems.findAll({
        where: {
          name: {
            [Op.in]: arr,
          },
        },
      });
      console.log("data>>>", data);
      if (data === null) {
        res.send({
          message: "Data Not Found In Grocery Store",
        });
      }
      await db.GroceryItems.destroy({
        where: {
          name: {
            [Op.in]: arr,
          },
        },
      });
      res.send({
        message: "Data Removed from Grocery Store",
      });
    } catch (error) {
      console.log(error);
      console.error(error);
    }
  }
  static async veiwGrocery(req, res) {
    try {
      const data = await db.GroceryItems.findAll({});
      if (data === null) {
        res.json({
          message: "Data Not Found In Grocery Store",
        });
      }
      res.send({
        data,
      });
    } catch (error) {
      console.error(error);
      console.log(error);
    }
  }

  // function updateGrocery(arr) {
  //   try {
  //     // const arr = req.body;
  //     const inputData = arr.map(({ item_id, name, price, quantity_left }) => ({
  //       item_id,
  //       name,
  //       price,
  //       quantity_left
  //     }));
  //     console.log(inputData)
  //     // Extract item_ids to create the where condition
  //     const itemIds = inputData.map(({ item_id }) => item_id);

  //     // Perform the bulk update
  //     // await db.GroceryItems.bulkUpdate(inputData, { where: { item_id: itemIds } });

  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).send({
  //       message: "An error occurred while updating items"
  //     });
  //   }
  // }
  static async updateGrocery(req, res) {
    try {
      const arr = req.body;
      const jsonString = JSON.stringify(arr);
      const inputData = JSON.parse(jsonString);
      // const inputData = parsedArray.map((item) => item.name);

      for (const data of inputData) {
        const { item_id, name, price, quantity_left } = data;

        // Perform the update
        await db.GroceryItems.update(
          { name, price, quantity_left }, // Update data
          { where: { item_id } } // Condition
        );
      }

      res.send({
        success: 1,
        message: "item updated Successfully",
      });
    } catch (error) {
      console.error(error);
      console.log(error);
    }
  }

  static async order(req, res) {
    try {
      const items = req.body;
      let nonExistingItems = [];
      let ItemNotInGrocery = [];
      let currentDate = new Date();
      let orderId;
      let amount;
      let orderItemId;
      let flag = false;
      for (const item of items) {
        const { name, quantity } = item;
        // Check if the item exists in the GroceryItems table
        const existingItem = await db.GroceryItems.findOne({
          where: { name },
        });
        if (existingItem) {
          // If the item exists, update the quantity_left field
          const newQuantityLeft =
            existingItem.dataValues.quantity_left - quantity;
          if (newQuantityLeft < 0) {
            ItemNotInGrocery.push(name);
          } else {
            await db.GroceryItems.update(
              { quantity_left: newQuantityLeft },
              { where: { name } }
            );
            orderId = crypto.randomUUID();
            amount = quantity * existingItem.dataValues.price;
            await db.Orders.create({
              order_id: orderId,
              user_id: req.userId,
              order_date: currentDate,
              total_amount: amount,
            });
            orderItemId = crypto.randomUUID();
            await db.OrderItems.create({
              order_item_id: orderItemId,
              order_id: orderId,
              item_id: existingItem.dataValues.item_id,
              quantity: quantity,
            });
            flag = true;
          }
        } else {
          nonExistingItems.push(name);
          console.log(`Item '${name}' does not exist in the database.`);
          // Handle the case where the item does not exist
        }
      }
      let message = "Order does not get placed";
      if (flag) {
        message = "Order is placed successfully";
      }
      res.json({
        message,
        nonExistingItems,
        ItemNotInGrocery,
      });
    } catch (error) {
      console.error("Error updating quantity:", error);
      res.status(500).json({ success: 0, message: "Internal server error" });
    }
  }
}

module.exports = Grocery;
