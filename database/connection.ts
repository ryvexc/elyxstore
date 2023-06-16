import mysql from "mysql2";

const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "ryve",
  password: "akugamers321",
  database: "dbtoko",
  // timezone: "utc",
});

export default db;
