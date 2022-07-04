const express = require('express');
const controllers = require('./controllers')

const app = express();

app.use(express.json());

app.get('/api/topics', controllers.getTopics);

app.use('*', (req, res) =>{
    res.status(404).send({msg:'Invalid path'})
  })
  
  app.use((err, req, res, next) => {
  res.status(500).send({msg: "internal server error"})
  })

module.exports = app;