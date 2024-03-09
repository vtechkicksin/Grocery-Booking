const db = require("../database");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

class Grocery {
  // static async register(req, res) {
  //   try {
  //     console.log("hi");
  //     const { name, email, password, passwordConfirm } = req.body;
  //     console.log("request body is =", req.body);
  //     console.log("confirm", passwordConfirm);

  //     db.query(`SELECT * From users WHERE email='${email}'`, (error, data) => {
  //       if (error) {
  //         console.log("error in making database call", error);
  //       }
  //       if (data.length > 0) {
  //         console.log("this is if");
  //         return res.send({
  //           message: "Already existing email",
  //         });
  //       } else if (password != passwordConfirm) {
  //         console.log("HERE naaaaaaaa");
  //         return res.send("register", {
  //           message: "Password do not matched",
  //         });
  //       }
  //       console.log("callback data", data);
  //     });

  //     let pass = password.toString();
  //     let hashPassword = await bcrypt.hash(pass, 8);

  //     let uuid = crypto.randomUUID();
  //     db.query(
  //       "INSERT INTO users SET ?",
  //       {
  //         userid: uuid,
  //         username: name,
  //         email: email,
  //         password: hashPassword,
  //         role: "user",
  //       },
  //       (error, data) => {
  //         if (error) {
  //           console.error(error);
  //         }

  //         console.log("insert wali query", data);
  //       }
  //     );
  //     // console.log("putting", puting);
  //     return res.json({ ok: true });
  //   } catch (error) {
  //     console.log("Getting error>>>>>>>");
  //     console.log(error);
  //   }
  // }
  static async register(req, res) {
    try {
      const { name, email, password, passwordConfirm } = req.body;

      db.query(
        `SELECT * FROM users WHERE email='${email}'`,
        async (error, data) => {
          if (error) {
            console.log("Error in making database call", error);
            return res.status(500).json({ error: "Internal server error" });
          }

          if (data.length > 0) {
            return res.send({ message: "Already existing email" });
          }

          if (password !== passwordConfirm) {
            return res.send({ message: "Passwords do not match" });
          }

          try {
            const hashPassword = await bcrypt.hash(password, 8);
            const uuid = crypto.randomUUID();
            console.log("here trying to execute insert query");
            db.query(
              "INSERT INTO users SET ?",
              {
                userid: uuid,
                username: name,
                email: email,
                password: hashPassword,
                role: "user",
              },
              (error, data) => {
                if (error) {
                  console.error("Error in insert query:", error);
                  return res
                    .status(500)
                    .json({ error: "Internal server error" });
                }
                console.log("Inserted data:", data);
                return res.json({ message: "Data has been inerted" });
              }
            );
          } catch (hashError) {
            console.error("Error hashing password:", hashError);
            return res.status(500).json({ error: "Internal server error" });
          }
        }
      );
    } catch (error) {
      console.error("Getting error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  static async login(req, res) {
    try {
      console.log("hi");
      const { name, email, password, passwordConfirm } = req.body;
      console.log("request body is =", req.body);
      console.log("confirm", passwordConfirm);

      //   const data = await db.query(
      //     `SELECT email From users WHERE email='${email}'`
      //   );
      //   if (data.length > 0) {
      //     return res.render("resgister", {
      //       message: "Already existing email",
      //     });
      //   } else if (password != passwordConfirm) {
      //     console.log("HERE naaaaaaaa");
      //     return res.render("register", {
      //       message: "Password do not matched",
      //     });
      //   }
      //   let hashPassword = await bcrypt.hash(password, 8);
      //   console.log(hashPassword);
      //   const puting = db.query("INSERT INTO users SET ?", {
      //     name: name,
      //     email: email,
      //     password: hashPassword,
      //   });

      //   console.log("putting", puting);
      return res.json({ ok: true });
    } catch (error) {
      console.log(error);
    }
  }
}
module.exports = Grocery;
