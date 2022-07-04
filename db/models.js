const db = require('./connection.js');
const models={};
const {articleData, commentData, topicData, userData}   = require('../db/data/test-data');

models.fetchTopics = () => {
    return db.query('SELECT * FROM topics;').then((topics)=>{
        return topics.rows;
    });
}

module.exports= models;