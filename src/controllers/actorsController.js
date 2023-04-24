const db = require('../database/models');
const sequelize = db.sequelize;


const genresController = {
    'list': async (req, res) => {
        db.Actor.findAll({
            include : [
                {
                    association : "movies",
                    attributes : {
                        exclude : ['awards','release_date','length','genre_id','created_at','updated_at']
                    }
                },
            ]
        })
           .then(actors => {
            //return res.send(actors)
            return res.render('actorsList',{
                actors
            })            
           })
           .catch(error => console.log(error))
  
    },
    'detail': async (req, res) => {
      return res.render('actorsDetail')
    }



}

module.exports = genresController;