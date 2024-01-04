import express from "express";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "wise_saying",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const app = express();

const port = 3000;

app.get("/wise-sayings", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM wise_saying ORDER BY id DESC");

  res.json(rows);
});
app.post("/wise-sayings", async (req, res) => {
  const { author, content } = req.body;
  if (!author) {
    res.status(400).json({
      msg: "author required",
    });
    return;
  }
  if (!content) {
    res.status(400).json({
      msg: "content required",
    });
    return;
  }
  const [rs] = await pool.query(
    `
    INSERT INTO wise_saying
    SET reg_date =NOW(),
    content =?,
    author=?
  `,
    [content, author]
  );

  res.status(201).json({
    id: res.insertId,
  });
});

app.delete("/wise-sayings/:id", async (req, res) => {
  const { id } = req.params;

  const [rows] = await pool.query("SELECT * FROM wise_saying WHERE id = ?", [
    id,
  ]);

  if (rows.length == 0) {
    res.status(404).send("not found");
    return;
  }

  const [rs] = await pool.query(
    `
    DELETE FROM wise_saying
    WHERE id = ?
    `,
    [id]
  );

  res.status(200).json({
    id,
  });
});

app.get("/wise-sayings/:id", async (req, res) => {
  const { id } = req.params;
  const [rows] = await pool.query("SELECT * FROM wise_saying WHERE id = ?", [
    id,
  ]);
  if (rows.length == 0) {
    res.status(404).send("not found");
    return;
  }
  res.json(rows[0]);
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
