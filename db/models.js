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
      return db.query(`SELECT articles.*, COUNT(comments.article_id)::INT AS comment_count FROM articles
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

exports.fetchArticles = () => {
    return db.query(`SELECT articles.*, COUNT(comments.article_id)::INT AS comment_count FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;`).then((articles)=>{
        return articles.rows;
    });
}

exports.fetchCommentsById = (id) => {
    if(isNaN(id)) {
        return Promise.reject({
          status: 400,
          msg: `Incorrect data type`,
        });
      }
    return db.query(`SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body FROM comments
    LEFT JOIN articles ON comments.article_id = articles.article_id
    WHERE comments.article_id = $1
    GROUP BY comments.comment_id;`, [id]).then((comments)=>{
        if (!comments.rows[0]) {
            return db.query(`SELECT articles.article_id FROM articles`).then((article_id)=>{
            if(article_id.rows.find(({ article_id }) => article_id == id)){
            return ([
              
            ]);
        } else{
            return Promise.reject({
                status: 404,
                msg: `No article found for article_id: ${id}`,
              });
        }
        })
          }
        return comments.rows;
    });
}