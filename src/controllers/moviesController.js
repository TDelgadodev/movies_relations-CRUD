const path = require("path");
const db = require("../database/models");
const sequelize = db.sequelize;
const { Op } = require("sequelize");

//Aqui tienen una forma de llamar a cada uno de los modelos
// const {Movies,Genres,Actor} = require('../database/models');

//Aquí tienen otra forma de llamar a los modelos creados
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;

const moviesController = {
  list: (req, res) => {
    db.Movie.findAll().then((movies) => {
      res.render("moviesList.ejs", { movies });
    });
  },
  detail: (req, res) => {
    db.Movie.findByPk(req.params.id, {
      include: ["genre", "actors"],
    }).then((movie) => {
      res.render("moviesDetail.ejs", { movie });
    });
  },
  new: (req, res) => {
    db.Movie.findAll({
      order: [["release_date", "DESC"]],
      limit: 5,
    }).then((movies) => {
      res.render("newestMovies", { movies });
    });
  },
  recomended: (req, res) => {
    db.Movie.findAll({
      where: {
        rating: { [db.Sequelize.Op.gte]: 8 },
      },
      order: [["rating", "DESC"]],
    }).then((movies) => {
      res.render("recommendedMovies.ejs", { movies });
    });
  },
  add: function (req, res) {
    db.Genre.findAll()
    
    .then(allGenres =>{
        return res.render("moviesAdd",{
          allGenres
        });
    })

  },
  create: function (req, res) {
    const {title,rating,awards,release_date,length,genre_id} = req.body

    db.Movie.create({
      title,
      rating,
      awards,
      release_date,
      length,
      genre_id
      
    }).then(()=>{
      return res.redirect('/movies')
    }) 
    .catch((error) => console.log(error));
  },
  edit: function (req, res) {
    const movie = db.Movie.findByPk(req.params.id);

    const allGenres = db.Genre.findAll();

    Promise.all([movie, allGenres]) 
      .then(([movie, allGenres]) => {
        return res.render("moviesEdit", {
          Movie: {
            ...movie.dataValues,
            release_date: movie.release_date.toISOString().split("T")[0],
          },
          allGenres,
        });
      })
      .catch((error) => console.log(error));
  },
  update: function (req, res) {

    db.Movie.update(
      {
        ...req.body,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    )
      .then(() => res.redirect("/movies/detail/" + req.params.id))
      .catch((error) => console.log(error));
  },
  delete: function (req, res) {
    db.Movie.findByPk(req.params.id)
      .then((movie) => {
        res.render("moviesDelete", { Movie: movie });
      })
      .catch((error) => console.log(error));
  },
  destroy: function (req, res) {
    db.Actor.update(
      {
        favorite_movie_id: null,
      },
      {
        where: {
          favorite_movie_id: req.params.id,
        },
      }
    )
      .then(() => {
        db.Actor_Movie.destroy({
          where: {
            movie_id: req.params.id,
          },
        }).then(() => {
          db.Movie.destroy({
            where: {
              id: req.params.id,
            },
          }).then(() => res.redirect("/movies"));
        });
      })
      .catch((error) => console.log(error));
  },
};

module.exports = moviesController;
