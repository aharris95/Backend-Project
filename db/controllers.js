const controllers={};
const models= require('./models');

controllers.getTopics = (req,res) => {
    models.fetchTopics().then((topics)=>{
        console.log(topics)
        res.send({topics});
    })
}

module.exports = controllers;