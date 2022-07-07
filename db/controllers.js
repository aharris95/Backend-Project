const models = require("./models");
const endpoints = require("../endpoints.json")

exports.getApi = (req, res) =>{
    res.send({endpoints})

}

exports.getTopics = (req, res) => {
  models.fetchTopics().then((topics) => {
    res.send({ topics });
  });
};

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;
  models
    .fetchArticle(article_id)
    .then((article) => {
      res.send({ article });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  models
    .updateArticleById(article_id, inc_votes)
    .then((article) => {
      res.send({ article });
    })
    .catch(next);
};

exports.getUsers = (req, res) => {
  models.fetchUsers().then((users) => {
    res.send({ users });
  });
};

exports.getArticles = (req, res, next) => {
  const { sort_by, order, filter } = req.query;
  models.fetchArticles(sort_by, order, filter).then((articles) => {
    res.send({ articles });
  }).catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  models
    .fetchCommentsById(article_id)
    .then((comments) => {
      res.send({ comments });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { body, author } = req.body;
  const { article_id } = req.params;
  models
    .insertComment(article_id, body, author)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
    const { comment_id } = req.params
    models.deleteComment(comment_id).then(()=>{
        res.status(204).send()
    }).catch(next);
}