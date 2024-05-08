const Sequelize = require("sequelize");

const db = require("../models");
const movietable = db.expensetracker_t_movie_m;

const RESPONSE = require("../constants/response");
const { MESSAGE } = require("../constants/message");
const { StatusCode } = require("../constants/HttpStatusCode");

exports.create = async (req, res) => {
  try {
    // Check if the movie name already exists
    const existingMovie = await movietable.findOne({
      where: { movie_name: req.body.movie_name },
    });
    if (existingMovie) {
      // If the movie already exists, throw an error
      throw new Error("Movie already exists");
    }

    // If the movie doesn't exist, proceed with creating a new entry
    const data = {
      movie_name: req.body.movie_name,
      active_status: req.body.active_status,
    };

    const response = await movietable.create(data);

    RESPONSE.Success.Message = MESSAGE.SUCCESS;
    RESPONSE.Success.data = { movie_id: response.movie_id };
    res.status(StatusCode.CREATED.code).send(RESPONSE.Success);
  } catch (error) {
    RESPONSE.Failure.Message = error.message;
    res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.Failure);
  }
};


// Retrieve all movies from the database.


exports.getUserDetails = async (req, res) => {
  try {
    const response = await movietable.findAll({
      where: {
        delete_status: 0,
      },
      attributes: [
        "movie_id",
        "movie_name",
        [
          Sequelize.literal(
            `CASE WHEN active_status = 1 THEN 'Active' ELSE 'Inactive' END`
          ),
          "status",
        ],
        "created_on",
      ],
    });

    // Send the response with the desired format
    RESPONSE.Success.Message = MESSAGE.SUCCESS;
    RESPONSE.Success.data = response;
    res.status(StatusCode.CREATED.code).send(RESPONSE.Success);
  } catch (error) {
    RESPONSE.Failure.Message = error.message;
    res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.Failure);
  }
};


// Find a single movie with a movie_id

exports.findOne = (req, res) => {
  const id = req.params.id;

  movietable
    .findByPk(id, {
      attributes: [
        "movie_id",
        "movie_name",
        "active_status",
        "created_on",
      ],
    })
    .then((data) => {
      if (data) {
        RESPONSE.Success.Message = MESSAGE.SUCCESS;
        RESPONSE.Success.data = data;
        res.status(StatusCode.CREATED.code).send(RESPONSE.Success);
      } else {
        res.status(404).send({
          message: `Cannot find movie with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      RESPONSE.Failure.Message = err.message;
      res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.Failure);
    });
};

exports.getmovieDropdown = async (req, res) => {
  try {
    const movie = await movietable.findAll({
      attributes: ["movie_id", "movie_name"],
      where: {
        delete_status: 0,
      },
    });

    const movieNames = movie.map((movie) => ({
      movie_id: movie.movie_id,
      movie_name: movie.movie_name,
    }));

    // Send the category names as a response
    RESPONSE.Success.Message = MESSAGE.SUCCESS;
    RESPONSE.Success.data = movieNames;
    res.status(StatusCode.OK.code).send(RESPONSE.Success);
  } catch (error) {
    // Handle errors
    RESPONSE.Failure.Message = error.message;
    res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.Failure);
  }
};

// Update a movie by the movie_id in the request
exports.update = async (req, res) => {
  try {
    const movie_id = req.params.id;
    const { movie_name, active_status, delete_status } = req.body;
    const movie = await movietable.findByPk(movie_id);
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }
    // Remove updated_on from the updateData object
    const updateData = {
      movie_name,
      active_status,
      delete_status,
      // Add updated_on with current timestamp directly to the updateData object
      updated_on: new Date(),
    };
    await movie.update(updateData);
    RESPONSE.Success.Message = MESSAGE.UPDATE;
    RESPONSE.Success.data = {};
    res.status(StatusCode.CREATED.code).send(RESPONSE.Success);
  } catch (error) {
    RESPONSE.Failure.Message = error.message;
    res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.Failure);
  }
};

// Delete a movie with the specified movie_id in the request
exports.delete = async (req, res) => {
  try {
    const movie_id = req.params.id;
    const data = { delete_status: 1 };
    const movie = await movietable.findByPk(movie_id);

    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    await movie.update(data);

    RESPONSE.Success.Message = MESSAGE.DELETE;
    RESPONSE.Success.data = {};
    res.status(StatusCode.CREATED.code).send(RESPONSE.Success);
  } catch (error) {
    RESPONSE.Failure.Message = error.message;
    res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.Failure);
  }
};
