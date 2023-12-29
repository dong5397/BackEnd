import express from "express";

const app = express();
const port = 3000;
const wiseSayings = [
  {
    content: "나는 김동욱이다",
    author: "김동욱",
  },
  { content: "나는 김동욱2이다", author: "김동욱2" },
];
app.get("/wise-sayings", (req, res) => {
  res.json(wiseSayings);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
