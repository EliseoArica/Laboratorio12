var mysql = require('mysql');

var conn = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"tienda12"
  });
conn.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Database connected");
    }
});
module.exports = conn;
