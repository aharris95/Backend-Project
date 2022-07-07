const db = require("./connection.js");
const {
  articleData,
  commentData,
  topicData,
  userData,
} = require("../db/data/test-data");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics;").then((topics) => {
    return topics.rows;
  });
};

exports.fetchArticle = (id) => {
  if (isNaN(id)) {
    return Promise.reject({
      status: 400,
      msg: `Incorrect data type`,
    });
  }
  return db
    .query(
      `SELECT articles.*, COUNT(comments.article_id)::INT AS comment_count FROM articles
      LEFT JOIN comments ON comments.article_id = articles.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id;`,
      [id]
    )
    .then((result) => {
      if (!result.rows[0]) {
        return Promise.reject({
          status: 404,
          msg: `No article found for article_id: ${id}`,
        });
      }
      return result.rows[0];
    });
};

exports.updateArticleById = (id, vote = 0) => {
  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
      [vote, id]
    )
    .then((result) => {
      if (!result.rows[0]) {
        return Promise.reject({
          status: 404,
          msg: `No article found for article_id: ${id}`,
        });
      } else if (!vote) {
        return Promise.reject({
          status: 400,
          msg: `Incorrect PATCH body input`,
        });
      }
      return result.rows[0];
    });
};

exports.fetchUsers = () => {
  return db.query("SELECT * FROM users;").then((users) => {
    return users.rows;
  });
};

exports.fetchArticles = (sort_by = "created_at", order = "DESC", filter) => {
  const sqlFilter = []
  return db.query("SELECT * FROM articles;").then((articles) => {
    const matchedArticles = articles.rows.filter(article => article.topic === filter)
    if (filter && matchedArticles.length >= 1){
      sqlFilter.push(`WHERE articles.topic =  '${String(filter)}'`)
    } else if (filter && matchedArticles.length === 0){
      return Promise.reject({status: 404, msg: 'Key does not exist'})
    }
  if (articles.rows[0].hasOwnProperty(sort_by)) {
    return db
      .query(
        `SELECT articles.*, COUNT(comments.article_id)::INT AS comment_count FROM articles
          LEFT JOIN comments ON comments.article_id = articles.article_id
          ${sqlFilter}
          GROUP BY articles.article_id
          ORDER BY articles.${sort_by} ${order}`
      )
      .then((articles) => {
        return articles.rows;
      });
    }
  })
};

exports.fetchCommentsById = (id) => {
  if (isNaN(id)) {
    return Promise.reject({
      status: 400,
      msg: `Incorrect data type`,
    });
  }
  return db
    .query(
      `SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body FROM comments
    LEFT JOIN articles ON comments.article_id = articles.article_id
    WHERE comments.article_id = $1
    GROUP BY comments.comment_id;`,
      [id]
    )
    .then((comments) => {
      if (!comments.rows[0]) {
        return db
          .query(`SELECT articles.article_id FROM articles`)
          .then((article_id) => {
            if (article_id.rows.find(({ article_id }) => article_id == id)) {
              return [];
            } else {
              return Promise.reject({
                status: 404,
                msg: `No article found for article_id: ${id}`,
              });
            }
          });
      }
      return comments.rows;
    });
};

exports.insertComment = (id, body, author) => {
  if (isNaN(id)) {
    return Promise.reject({
      status: 400,
      msg: `Incorrect data type`,
    });
  } else if (!body || !author) {
    return Promise.reject({
      status: 400,
      msg: `Post body incorrect`,
    });
  }
  return db
    .query(`SELECT articles.article_id FROM articles WHERE article_id = ${id}`)
    .then((article_id) => {
      if (!article_id.rows.length) {
        return Promise.reject({
          status: 404,
          msg: `No article found for article_id: ${id}`,
        });
      }
      if (article_id.rows[0].article_id == id) {
        return db
          .query(
            "INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *;",
            [body, author, id]
          )
          .then(({ rows }) => {
            return rows[0];
          });
      }
    });
};
