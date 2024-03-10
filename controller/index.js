const db = require("../models");
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
  static async veiwGrocery(req, res) {
    try {
      const data = await db.GroceryItems.findAll({});
      res.send({
        data,
      });
    } catch (error) {
      console.error(error);
      console.log(error);
    }
  }
  static async updateGrocery(req, res) {
    try {
      const arr = req.body;
      const jsonString = JSON.stringify(arr);
      const parsedArray = JSON.parse(jsonString);
      const namesToFind = parsedArray.map((item) => item.name);
      const data = await db.GroceryItems.findAll({
        where: {
          name: {
            [Op.in]: namesToFind,
          },
        },
      });
      console.log("data>>>>>>>", data);
      res.send({
        data,
      });
    } catch (error) {
      console.error(error);
      console.log(error);
    }
  }
}

module.exports = Grocery;
