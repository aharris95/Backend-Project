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

