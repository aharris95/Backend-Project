const db = require('./connection.js');
const {articleData, commentData, topicData, userData}   = require('../db/data/test-data');

exports.fetchTopics = () => {
    return db.query('SELECT * FROM topics;').then((topics)=>{
        return topics.rows;
    });
}

exports.fetchArticle = (id) => { 
    id = parseInt(id)
    if(!id) {
        return Promise.reject({
          status: 404,
          msg: `Incorrect data type`,
        });
      }
    return db.query('SELECT * FROM articles WHERE article_id = $1;', [id]).then((result)=>{
        if (!result.rows[0]) {
            return Promise.reject({
              status: 404,
              msg: `No article found for article_id: ${id}`,
            });
          }
        return result.rows[0]
    })
};