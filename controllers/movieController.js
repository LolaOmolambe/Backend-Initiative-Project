const fs = require("fs");
const moviesData = JSON.parse(
    fs.readFileSync(`${__dirname}/../data/movies.js`)
);
const uuid = require("uuid");

exports.getAllMovies = (req, res, next) => {
  try {
    res.status(200).json({
      message: "Success",
      data: moviesData,
    });
  } catch (err) {
    res.status(500).json({
      message: "Oops, Something went wrong",
    });
  }
};

exports.getMovie = (req, res, next) => {
  try {
    let result = moviesData.filter((movie) => movie.id === req.params.id);
    if (result.length === 0) {
      res.status(404).json({
        message: `Movie with id ${req.params.id} does not exist`,
        data: [],
      });
    } else {
      res.status(200).json({
        message: "Success",
        data: result,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Oops, Something went wrong",
    });
  }
};

exports.createMovie = (req, res, next) => {
  try {
    let newMovie = {
      title: req.body.title,
      genre: req.body.genre,
      id: uuid.v4(),
      status: "active"
    };

    if (!newMovie.title || !newMovie.genre) {
      return res.status(400).json({
        message: "Please include title and genre",
      });
    }
    moviesData.push(newMovie);

    fs.writeFileSync(`${__dirname}/../data/movies.js`, JSON.stringify(moviesData));

    res.status(201).json({
      status: "Success",
      data: newMovie,
    });
  } catch (err) {
      console.log(err)
    res.status(500).json({
      message: "Oops, Something went wrong",
    });
  }
};

exports.updateMovie = (req, res, next) => {
  try {
    const movieExists = moviesData.some((movie) => movie.id === req.params.id);
    if (movieExists) {
      const data = req.body;
      moviesData.forEach((movie) => {
        if (movie.id === req.params.id) {
          movie.title = data.title ? data.title : movie.title;
          movie.genre = data.genre ? data.genre : movie.genre;
          
          fs.writeFileSync(`${__dirname}/../data/movies.js`, JSON.stringify(moviesData));
          return res.status(200).json({
            status: "Success",
            data: movie,
          });
        }
      });
    } else {
      res.status(404).json({
        message: `Movie with id ${req.params.id} does not exist`,
        data: [],
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Oops, Something went wrong",
    });
  }
};

exports.deleteMovie = (req, res, next) => {
  try {
    let movie = moviesData.find((movie) => movie.id === req.params.id);

    if (movie) {
        let result = moviesData.filter(movie => movie.id !== req.params.id);
        fs.writeFileSync(`${__dirname}/../data/movies.js`, JSON.stringify(result));
        return res.status(200).json({
            status: "Success",
            data: null,
          });
    } else {
      res.status(404).json({
        message: `Movie with id ${req.params.id} does not exist`,
        data: [],
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Oops, Something went wrong",
    });
  }
};
