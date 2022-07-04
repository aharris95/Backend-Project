const db = require('./connection.js');
const {articleData, commentData, topicData, userData}   = require('../db/data/test-data');

exports.fetchTopics = () => {
    return db.query('SELECT * FROM topics;').then((topics)=>{
        return topics.rows;
    });
}

exports.updateArticleById = (id, vote = 0) => {
    return db.query('UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;',[vote, id]).then((result) => {
        console.log(vote)
        if (!result.rows[0]) {
            return Promise.reject({
              status: 404,
              msg: `No article found for article_id: ${id}`,
            });
          } else if (!vote) {
            return Promise.reject({
              status: 404,
              msg: `Incorrect PATCH body input`,
            });
        }
        return result.rows[0]
    });
};