const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1052Emre?", // your password
  database: "CRUDDataBase",
});

app.get("/get", (req, res) => {
  const sqlSelect = "SELECT * FROM employees";
  db.query(sqlSelect, (err, result) => {
    if (err) console.log(err);
    else res.send(result);
  });
});

app.post("/create", (req, res) => {
  const primaryKey = req.body.primaryKey;
  const name = req.body.name;
  const age = req.body.age;
  const country = req.body.country;
  const position = req.body.position;
  const wage = req.body.wage;

  const sqlInstert =
    "INSERT INTO employees (primaryKey, name, age, country, position, wage) VALUES (?,?,?,?,?,?)";
  db.query(
    sqlInstert,
    [primaryKey, name, age, country, position, wage],
    (err, result) => {
      if (err) console.log(err);
      else res.send("Value Inserted");
    }
  );
});

app.delete("/:employeeCode", (req, res) => {
  const employeeCode = req.params.employeeCode;

  const sqlDelete = "DELETE FROM employees WHERE primaryKey = ?";

  db.query(sqlDelete, employeeCode, (err, result) => {
    if (err) console.log(err);
    else res.send("Item Removed");
  });
});

app.put("/update", (req, res) => {
  const primaryKey = req.body.primaryKey;
  const name = req.body.name;
  const age = req.body.age;
  const country = req.body.country;
  const position = req.body.position;
  const wage = req.body.wage;

  const sqlUpdate =
    "UPDATE employees SET name = ?, age = ?, country = ?, position = ?, wage = ? WHERE primaryKey = ?";

  db.query(sqlUpdate, [name, age, country, position, wage, primaryKey] , (err,result) => {
    if(err) console.log(err);
    else res.send("Values Changed")
  });
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
