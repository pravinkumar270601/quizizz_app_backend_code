const db = require("../models");
const { subcategorytable } = require("../models");
const crewtable = db.expensetracker_t_crew_m;
const subcategory = db.expensetracker_t_subcategory_m;
const shootingSpot = db.expensetracker_t_shootingspot_m;

const RESPONSE = require("../constants/response");
const { MESSAGE } = require("../constants/message");
const { StatusCode } = require("../constants/HttpStatusCode");
const { QueryTypes } = require("sequelize");

exports.createcrew = async (req, res) => {
  try {
    const data = {
      crew_name: req.body.crew_name,
      category_id: req.body.category_id,
      sub_category_id: req.body.sub_category_id,
      mobile_no: req.body.mobile_no,
      movie_id: req.body.movie_id,
      gender: req.body.gender, 
      created_on: new Date()
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

exports.getuserDetails = async (req, res) => {
  try {
    const query = `
      SELECT
        crew.crew_id,
        crew.movie_id,
        crew.category_id,
        crew.sub_category_id,
        movie.movie_name,
        category.category_name,
        sub_category.sub_category_name,
        crew.crew_name,
        CASE
            WHEN crew.gender = 1 THEN 'Male'
            WHEN crew.gender = 2 THEN 'Female'
            WHEN crew.gender = 3 THEN 'Others'
            ELSE 'Unknown'
        END AS gender,
        crew.mobile_no,
        DATE_FORMAT(crew.created_on, '%d %b %Y') AS created_on
      FROM
        expensetracker_t_crew_m AS crew
      LEFT JOIN
        expensetracker_t_movie_m AS movie ON crew.movie_id = movie.movie_id
      LEFT JOIN
        expensetracker_t_category_m AS category ON crew.category_id = category.category_id
      LEFT JOIN
        expensetracker_t_subcategory_m AS sub_category ON crew.sub_category_id = sub_category.sub_category_id
      WHERE
        crew.delete_status = 0;
    `;

    
    const response = await db.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });

    RESPONSE.Success.Message = MESSAGE.SUCCESS;
    RESPONSE.Success.data = response;
    res.status(StatusCode.OK.code).send(RESPONSE.Success);
  } catch (error) {
    RESPONSE.Failure.Message = error.message;
    res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.Failure);
  }
};

exports.getSubcategoryDropdown = async (req, res) => {
  try {
    // Assuming category_id is provided in the request body or query parameters
    const category_id = req.body.category_id
    const movie_id = req.body.movie_id 

    // Ensure category_id is provided
    if (!category_id) {
      throw new Error("Category ID is required");
    }

    const subcategories = await subcategory.findAll({
      attributes: {
        exclude: ["category_id", "movie_id", "active_status", "delete_status"],
      },
      where: {
        category_id: category_id,
        movie_id:movie_id, // Filter subcategories by the specified category_id
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
    // Assuming movie_id is provided in the request body or query parameters
    const movie_id = req.body.movie_id ;

    // Ensure movie_id is provided
    if (!movie_id) {
      throw new Error("Movie ID is required");
    }

    const shootingspots = await shootingSpot.findAll({
      attributes: {
        exclude: [
          "contact_no",
          "active_status",
          "delete_status",
          "created_on",
          "updated_on",
        ],
      },
      where: {
        movie_id: movie_id, // Filter shooting spots by the specified movie_id
      },
    });

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


exports.findOne = async (req, res) => {
  try {
    const crew_id = req.params.crew_id;
    const query = `
      SELECT
        crew.crew_id,
        crew.movie_id,
        crew.category_id,
        crew.sub_category_id,
        movie.movie_name,
        category.category_name,
        sub_category.sub_category_name,
        crew.crew_name,
        crew.gender,
        crew.mobile_no,
        DATE_FORMAT(crew.created_on, '%d %b %Y') AS created_on
      FROM
        expensetracker_t_crew_m AS crew
      LEFT JOIN
        expensetracker_t_movie_m AS movie ON crew.movie_id = movie.movie_id
      LEFT JOIN
        expensetracker_t_category_m AS category ON crew.category_id = category.category_id
      LEFT JOIN
        expensetracker_t_subcategory_m AS sub_category ON crew.sub_category_id = sub_category.sub_category_id
      WHERE
      crew.delete_status = 0 AND crew.crew_id = :crew_id 
    `;

    const response = await db.sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: { crew_id: crew_id },
    });

    RESPONSE.Success.Message = MESSAGE.SUCCESS;
    RESPONSE.Success.data = response;
    res.status(StatusCode.OK.code).send(RESPONSE.Success);
  } catch (error) {
    RESPONSE.Failure.Message = error.message;
    res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.Failure);
  }
};

exports.update = async (req, res) => {
  try {
    const crew_id = req.params.id;
    const {
      crew_name,
      category_id,
      sub_category_id,
      movie_id,
      gender,
      mobile_no,
    } = req.body;
    const crew = await crewtable.findByPk(crew_id);
    if (!crew) {
      return res.status(404).json({ error: "Crew not found" });
    }

    // Set default value for updated_on if not provided in the request body
    const defaultUpdatedOn = new Date(); // Use current date and time as default

    await crew.update({
      crew_name,
      category_id,
      sub_category_id,
      movie_id,
      gender,
      mobile_no,
      updated_on: defaultUpdatedOn, // Add updated_on field with default value
    });

    // RESPONSE.Success.Message = MESSAGE.UPDATE;
    RESPONSE.Success.Message = MESSAGE.UPDATE;
    RESPONSE.Success.data = {};
    res.status(StatusCode.OK.code).send(RESPONSE.Success);
  } catch (error) {
    console.log(error, "error");
    RESPONSE.Failure.Message = error.message;
    res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.Failure);
  }
};


exports.delete = async (req, res) => {
  try {
    const crew_id = req.params.id;
    const data = { delete_status: 1 };
    console.log("crew_id : " + crew_id);
    const crew = await crewtable.findByPk(crew_id);

    if (!crew) {
      return res.status(404).json({ error: "Crew not found" });
    }

    await crew.update(data);

    res.json({
      message: "Deleted successfully",
      data: {
        crew_id: crew_id,
        delete_status: 1,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
