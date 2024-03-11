module.exports = {
  HOST: "localhost",
  USER: "sandeep_kr",
  PASSWORD: "password",
  DB: "db_conn",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  superAdmin:{
    email:"superAdmin.logipe@gmail.com"
  }
};
