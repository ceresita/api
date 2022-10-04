const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");

const app = express();
const port = 3500;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "bookstore",
});

connection.connect();

app.get("/books", (req, res) => {
  connection.query(
    `select book.id, book.title, book.numberOfPages, author.name as authorName from author inner join book on author.id=book.authorId`,
    function (err, rows, fields) {
      if (err) res.sendStatus(500);
      else res.json(rows);
    }
  );
});

app.delete("/books/:id", (req, res) => {
  const bookId = req.params.id;
  connection.query(
    `delete from book where id = ${bookId}`,
    function (err, rows, fields) {
      if (err) res.sendStatus(500);
      else res.sendStatus(204);
    }
  );
});

app.get("/books/:id", (req, res) => {
  const bookId = req.params.id;
  connection.query(
    `select book.id, book.title, book.numberOfPages, author.name as authorName from author inner join book on author.id=book.authorId where book.id = ${bookId}`,
    function (err, rows, fields) {
      if (err) res.sendStatus(500);
      else if (rows[0]) {
        res.json(rows[0]);
      } else {
        res.sendStatus(404);
      }
    }
  );
});

app.post("/books", (req, res) => {
  const book = req.body;
  const sql = `insert into book (title, numberOfPages, authorId) values ('${book.title}', ${book.numberOfPages}, ${book.authorId})`;
  connection.query(sql, function (err, rows, fields) {
    if (err) res.sendStatus(500);
    else res.sendStatus(201);
  });
});

app.get("/authors/:id", (req, res) => {
  const authorId = req.params.id;
  connection.query(
    `select * from author where id = ${authorId}`,
    function (err, rows, fields) {
      if (err) res.sendStatus(500);
      else if (rows[0]) {
        res.json(rows[0]);
      } else {
        res.sendStatus(404);
      }
    }
  );
});

app.post("/authors", (req, res) => {
  const author = req.body;
  const sql = `insert into author (name) values ('${author.name}')`;
  connection.query(sql, function (err, rows, fields) {
    if (err) res.sendStatus(500);
    else res.sendStatus(201);
  });
});

app.get("/authors", (req, res) => {
  connection.query(`select id, name from author`, function (err, rows, fields) {
    if (err) res.sendStatus(500);
    else res.json(rows);
  });
});

app.listen(port, () => console.log(`Starting api on port ${port}...`));
