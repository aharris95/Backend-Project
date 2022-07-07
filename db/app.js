const express = require("express");
const controllers = require("./controllers");

const app = express();

app.use(express.json());

app.get("/api/topics", controllers.getTopics);
app.get("/api/articles/:article_id", controllers.getArticle);
app.get("/api/users", controllers.getUsers);
app.get("/api/articles", controllers.getArticles);
app.get(
  "/api/articles/:article_id/comments",
  controllers.getCommentsByArticleId
);

app.post("/api/articles/:article_id/comments", controllers.postComment);

app.patch("/api/articles/:article_id", controllers.patchArticleById);

app.delete('/api/comments/:comment_id', controllers.deleteCommentById)

app.use("*", (req, res) => {
  res.status(404).send({ msg: "Invalid path" });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "internal server error" });
});

module.exports = app;
