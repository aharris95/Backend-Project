const models= require('./models');

exports.getTopics = (req,res) => {
    models.fetchTopics().then((topics)=>{
        res.send({topics});
    })
}

