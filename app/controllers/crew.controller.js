// const express = require("express");
const db = require("../models");
const { subcategorytable } = require("../models");
const crewtable = db.expensetracker_t_crew_m;
const subcategory = db.expensetracker_t_subcategory_m;
const shootingSpot = db.expensetracker_t_shootingspot_m ;

const RESPONSE = require("../constants/response");
const { MESSAGE } = require("../constants/message");
const { StatusCode } = require("../constants/HttpStatusCode");

//create and save new categorytable
exports.createcrew = async (req, res) => {
  try {
    const data = {
      crew_name: req.body.crew_name,
      category_id: req.body.category_id,
      sub_category_id: req.body.sub_category_id,
      mobile_no:req.body.mobile_no,
      movie_id: req.body.movie_id,
      nationality: req.body.nationality,
      gender: req.body.gender,
      creatd_on: req.body.creatd_on,
    };
    const response = await crewtable.create(data);

    RESPONSE.Success.Message = MESSAGE.SUCCESS;
    RESPONSE.Success.data = { crew_id: response.crew_id };
    res.status(StatusCode.CREATED.code).send(RESPONSE.Success);
  } catch (error) {
    console.log("error", error);
    RESPONSE.Failure.Message = error.message;
    res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.Failure);
  }
};

// Retrieve all crewtable from the database.
const { QueryTypes } = require("sequelize");

exports.getuserDetails = async (req, res) => {
  try {
    const query = `
      SELECT
        movie.movie_name,
        spot.location,
        category.category_name,
        sub_category.sub_category_name,
        crew.crew_name,
        crew.gender,
        crew.mobile_no,
        crew.nationality,
        spot.created_on
      FROM
        expensetracker_t_shootingspot_m AS spot
      LEFT JOIN
        expensetracker_t_movie_m AS movie ON spot.movie_id = movie.movie_id
      LEFT JOIN
        expensetracker_t_category_m AS category ON spot.movie_id = category.movie_id
      LEFT JOIN
        expensetracker_t_subcategory_m AS sub_category ON spot.movie_id = sub_category.movie_id
      LEFT JOIN
        expensetracker_t_crew_m AS crew ON spot.movie_id = crew.movie_id
      WHERE
        spot.active_status = 1;
    `;

    const response = await db.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });

    RESPONSE.Success.Message = MESSAGE.SUCCESS;
    RESPONSE.Success.data = response;
    res.status(StatusCode.CREATED.code).send(RESPONSE.Success);
  } catch (error) {
    RESPONSE.Failure.Message = error.message;
    res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.Failure);
  }
};

// Get subcategory dropdown options
exports.getSubcategoryDropdown = async (req, res) => {
  try {
    const subcategories = await subcategory.findAll({
      attributes: {
        exclude: ["category_id", "movie_id", "active_status", "delete_status"],
      },
    });

    const dropdownOptions = subcategories.map((subcategory) => ({
      sub_category_id: subcategory.sub_category_id,
      sub_category_name: subcategory.sub_category_name,
    }));

    RESPONSE.Success.Message = MESSAGE.SUCCESS;
    RESPONSE.Success.data = dropdownOptions;
    res.status(StatusCode.OK.code).send(RESPONSE.Success);
  } catch (error) {
    RESPONSE.Failure.Message = error.message;
    res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.Failure);
  }
};

exports.getshootingspotDropdown = async (req, res) => {
  try {
    const shootingspots = await shootingSpot.findAll({
      attributes: {
        exclude: [
          "contact_no",
          "movie_id",
          "active_status",
          "delete_status",
          "created_on",
          "updated_on",
        ],
      },
    });
    console.log('shootingspots', shootingspots);

    const dropdownOptions = shootingspots.map((shootingSpot) => ({
      spot_id: shootingSpot.spot_id,
      location: shootingSpot.location,
    }));

    RESPONSE.Success.Message = MESSAGE.SUCCESS;
    RESPONSE.Success.data = dropdownOptions;
    res.status(StatusCode.OK.code).send(RESPONSE.Success);
  } catch (error) {
    RESPONSE.Failure.Message = error.message;
    res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.Failure);
  }
};
// Find a single crewtable with an crew_id
exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const query = `
      SELECT
        movie.movie_name,
        spot.location,
        category.category_name,
        sub_category.sub_category_name,
        crew.crew_name,
        crew.gender,
        crew.mobile_no,
        crew.nationality,
        spot.created_on
      FROM
        expensetracker_t_shootingspot_m AS spot
      LEFT JOIN
        expensetracker_t_movie_m AS movie ON spot.movie_id = movie.movie_id
      LEFT JOIN
        expensetracker_t_category_m AS category ON spot.movie_id = category.movie_id
      LEFT JOIN
        expensetracker_t_subcategory_m AS sub_category ON spot.movie_id = sub_category.movie_id
      LEFT JOIN
        expensetracker_t_crew_m AS crew ON spot.movie_id = crew.movie_id
      WHERE
        spot.active_status = 1 AND crew.crew_id=:crew_id;
    `;

    const response = await db.sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: { crew_id: id },
    });

    RESPONSE.Success.Message = MESSAGE.SUCCESS;
    RESPONSE.Success.data = Response;
    res.status(StatusCode.OK.code).send(RESPONSE.Success);
  } catch (error) {
    RESPONSE.Failure.Message = error.message;
    res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.Failure);
  }
};
// Update a crewtable by the crew_id in the request
exports.update = async (req, res) => {
  try {
    const crew_id = req.params.id;
    const { crew_name, category_id, sub_category_id, movie_id, gender,mobile_no,nationality,created_on } =
      req.body;
    const crew = await crewtable.findByPk(crew_id);
    if (!crew) {
      return res.status(404).json({ error: "crew not found" });
    }
    await crew.update({
      crew_name,
      category_id,
      sub_category_id,
      movie_id,
      gender,
      mobile_no,
      nationality,
      created_on,
    });
    res.json({ message: "UPDATED SUCCESSFULLY" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a crewtable with the specified crew_id in the request
exports.delete = async (req, res) => {
  try {
    const crew_id = req.params.id;
    const data = { delete_status: 1 };
    console.log("crew_id : " + crew_id);
    const crew = await crewtable.findByPk(crew_id);

    if (!crew) {
      return res.status(404).json({ error: "crew not found" });
    }

    await crew.update(data);

    // Send response with success message and updated data
    res.json({
      message: "DELETED SUCCESSFULLY",
      data: {
        crew_id: crew_id,
        delete_status: 1,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
