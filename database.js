const { createPool } = require("mysql");

const pool = createPool({
  host: "localhost",
  user: "sandeep_kr",
  password: "password",
  database: "db_conn",
  connectionLimit: 10,
});

pool.query("SELECT * FROM users", (error, results, fields) => {
  if (error) {
    console.error("Error fetching data: ", error);
    return;
  }
  console.log("Results: ", results);
});

module.exports = pool;
