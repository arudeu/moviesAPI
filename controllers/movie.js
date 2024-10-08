const Movie = require("../models/Movie");

module.exports.addMovie = (req, res) => {
  let newMovie = new Movie({
    title: req.body.title,
    director: req.body.director,
    year: req.body.year,
    description: req.body.description,
    genre: req.body.genre,
  });

  newMovie
    .save()
    .then((savedMovie) => res.status(201).send(savedMovie))
    .catch((saveErr) => {
      console.error("Error in saving the Movie: ", saveErr);
      return res.status(500).send({ error: "Failed to save the Movie" });
    });
};

module.exports.getMovies = (req, res) => {
  Movie.find({})
    .then((Movies) => {
      if (Movies.length > 0) {
        return res.status(200).send({ Movies });
      } else {
        return res.status(200).send({ message: "No Movies found." });
      }
    })
    .catch((err) => res.status(500).send({ error: "Error finding Movies." }));
};

module.exports.getMovie = (req, res) => {
  Movie.findById(req.params.id)
    .then((foundMovie) => {
      if (!foundMovie) {
        return res.status(404).send({ error: "Movie not found" });
      }
      return res.status(200).send({ foundMovie });
    })
    .catch((err) => {
      console.error("Error in fetching the Movie: ", err);
      return res.status(500).send({ error: "Failed to fetch Movie" });
    });
};

module.exports.updateMovie = (req, res) => {
  let movieUpdates = {
    title: req.body.title,
    director: req.body.director,
    year: req.body.year,
    description: req.body.description,
    genre: req.body.genre,
  };

  return Movie.findByIdAndUpdate(req.params.id, movieUpdates)
    .then((updatedMovie) => {
      if (!updatedMovie) {
        return res.status(404).send({ error: "Movie not found" });
      }

      return res.status(200).send({
        message: "Movie updated successfully",
        updatedMovie: updatedMovie,
      });
    })
    .catch((err) => {
      console.error("Error in updating an Movie : ", err);
      return res.status(500).send({ error: "Error in updating an Movie." });
    });
};

module.exports.deleteMovie = (req, res) => {
  return Movie.deleteOne({ _id: req.params.id })
    .then((deletedResult) => {
      if (deletedResult < 1) {
        return res.status(400).send({ error: "No Movie deleted" });
      }

      return res.status(200).send({
        message: "Movie deleted successfully",
      });
    })
    .catch((err) => {
      console.error("Error in deleting an Movie : ", err);
      return res.status(500).send({ error: "Error in deleting an Movie." });
    });
};

module.exports.addMovieComment = (req, res) => {
  const movie = Movie.findById(req.params.id);
  if (!movie) {
    return res.status(404).send({ message: "Movie not found" });
  }
  const { comment } = req.body;
  const newComment = { userId: req.user._id, comment };
  movie.comments.push(newComment);
  movie.save();
  res.status(201).send(movie.comments);
};

module.exports.getMovieComments = (req, res) => {
  const movie = Movie.findById(req.params.id).populate(
    "comments.userId",
    "name"
  );
  if (!movie) {
    return res.status(404).send({ message: "Movie not found" });
  }
  res.status(200).send(movie.comments);
};
