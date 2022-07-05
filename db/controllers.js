const models= require('./models');

exports.getTopics = (req,res) => {
    models.fetchTopics().then((topics)=>{
        res.send({topics});
    })
}

exports.getArticle = (req,res,next) => {
    const { article_id } = req.params;
    models.fetchArticle(article_id).then((article)=>{
        res.send({article});
    }).catch(next)
}

exports.patchArticleById = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    models.updateArticleById(article_id, inc_votes).then((article)=>{
      res.send({article})
    }).catch(next)
  };

  exports.getUsers = (req,res) => {
    models.fetchUsers().then((users)=>{
        res.send({users});
    })
}

exports.getArticles = (req,res) => {
    models.fetchArticles().then((articles)=>{
        res.send({articles});
    })
}

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    models.fetchCommentsById(article_id).then((comments)=>{
    if(comments[0].msg){
        res.send({msg: comments[0].msg})
    } else{
     res.send({comments}) 
    }
    }).catch(next)
  };