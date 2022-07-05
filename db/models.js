const db = require('./connection.js');
const {articleData, commentData, topicData, userData}   = require('../db/data/test-data');

exports.fetchTopics = () => {
    return db.query('SELECT * FROM topics;').then((topics)=>{
        return topics.rows;
    });
}

exports.fetchArticle = (id) => { 
    if(isNaN(id)) {
        return Promise.reject({
          status: 400,
          msg: `Incorrect data type`,
        });
      }
      return db.query(`SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles
      LEFT JOIN comments ON comments.article_id = articles.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id;`, [id]).then((result)=>{
        if (!result.rows[0]) {
            return Promise.reject({
              status: 404,
              msg: `No article found for article_id: ${id}`,
            });
          }
        return result.rows[0]
    })
};

exports.updateArticleById = (id, vote = 0) => {
    return db.query('UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;',[vote, id]).then((result) => {
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
    return result.rows[0]
});
}

exports.fetchUsers = () => {
    return db.query('SELECT * FROM users;').then((users)=>{
        return users.rows;
    });
}