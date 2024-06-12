const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const port = 3003;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const connectionToDB = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "test",
});

// POST
app.post("/square", (req, res) => {
  const {
    left_border,
    top_border,
    right_border,
    bottom_border,
    x_coord,
    y_coord,
  } = req.body;
  const sqlQuery = `INSERT INTO square(left_border, top_border, right_border, bottom_border, x_coord, y_coord) VALUES(?, ?, ?, ?, ?, ?)`;
  connectionToDB.query(
    sqlQuery,
    [left_border, top_border, right_border, bottom_border, x_coord, y_coord],
    function (err, result) {
      if (err) {
        console.error("Error inserting data into database:", err);
        res.status(500).json({ message: "Error inserting data" });
        return;
      }
      res.json({ message: "Data inserted successfully" });
    }
  );
});

// GET
app.get("/square/:id", (req, res) => {
  const squareId = req.params.id;
  const sqlQuery = `SELECT * FROM square WHERE id = ?`;
  connectionToDB.query(sqlQuery, [squareId], function (err, result) {
    if (err) {
      console.error("Error fetching data from database:", err);
      res.status(500).json({ message: "Error fetching data from database" });
      return;
    }

    if (result.length === 0) {
      res.status(404).json({ message: "Square not found" });
      return;
    }

    const squareData = result[0]; // Pirmas rezultato elementas
    res.json(squareData);
  });
});

// DELETE
// app.delete("/square/:id", (req, res) => {
//   const sqlQuery = `DELETE FROM square WHERE id=?`;

//   connectionToDB.query(sqlQuery, [req.params.id], function (err, result) {
//     if (err) throw err;
//     res.json({ message: "deleted" });
//   });
// });

// // UPDATE
// app.put("/square/:id", (req, res) => {
//   const sqlQuery = `UPDATE square SET left=?, top=?, right=?, bottom=? WHERE id=?`;

//   connectionToDB.query(
//     sqlQuery,
//     [
//       req.body.left,
//       req.body.top,
//       req.body.right,
//       req.body.bottom,
//       req.params.id,
//     ],
//     function (err, result) {
//       if (err) throw err;
//       res.json({ message: "updated" });
//     }
//   );
// });

app.listen(port, () => {
  console.log(`listening port ${port}`);
});
