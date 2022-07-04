const db = require('./connection.js');
const {articleData, commentData, topicData, userData}   = require('../db/data/test-data');

exports.fetchTopics = () => {
    return db.query('SELECT * FROM topics;').then((topics)=>{
        return topics.rows;
    });
}

