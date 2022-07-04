const models= require('./models');

exports.getTopics = (req,res) => {
    models.fetchTopics().then((topics)=>{
        res.send({topics});
    })
}

exports.patchArticleById = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    models.updateArticleById(article_id, inc_votes).then((article)=>{
      res.send({article})
    }).catch(next)
  };