const express = require("express");
const db = require("../models");
const expensetable = db.expensetracker_t_expense_t;
const subcategorytable = db.expensetracker_t_subcategory_m;
const categorytable = db.expensetracker_t_category_m;
const { QueryTypes } = require("sequelize");
const RESPONSE = require("../constants/response");
const { MESSAGE } = require("../constants/message");
const { StatusCode } = require("../constants/HttpStatusCode");

exports.create = async (req, res) => {
  try {
    const data = {
      sub_category_name: req.body.sub_category_name,
      category_id: req.body.category_id,
      movie_id: req.body.movie_id,
      created_on: new Date().toISOString().slice(0, 10), // Change to YYYY-MM-DD format
    };
    const response = await subcategorytable.create(data);

    RESPONSE.Success.Message = MESSAGE.SUCCESS;
    RESPONSE.Success.data = { sub_category_id: response.sub_category_id };
    res.status(StatusCode.CREATED.code).send(RESPONSE.Success);
  } catch (error) {
    RESPONSE.Failure.Message = error.message;
    res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.Failure);
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const query = `
      SELECT s.sub_category_id,m.movie_name, c.category_name, s.sub_category_name, DATE_FORMAT(s.created_on, '%d %b %Y') AS created_on 
      FROM expensetracker_t_subcategory_m AS s 
      LEFT JOIN expensetracker_t_category_m AS c ON s.category_id = c.category_id 
      LEFT JOIN expensetracker_t_movie_m AS m ON c.movie_id = m.movie_id
      WHERE s.active_status = 1 AND s.delete_status = 0;
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

exports.findOne = async (req, res) => {
  try {
    const sub_category_id = req.params.sub_category_id;
    const query = `
       SELECT m.movie_name, c.category_name, s.sub_category_name, DATE_FORMAT(s.created_on, '%d %b %Y') AS created_on 
      FROM expensetracker_t_subcategory_m AS s 
      LEFT JOIN expensetracker_t_category_m AS c ON s.category_id = c.category_id 
      LEFT JOIN expensetracker_t_movie_m AS m ON s.movie_id = m.movie_id
      WHERE s.sub_category_id = :sub_category_id AND s.active_status = 1 AND s.delete_status = 0;
    `;

    const response = await db.sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: { sub_category_id: sub_category_id },
    });

    if (response.length > 0) {
      res.status(StatusCode.OK.code).send({
        message: MESSAGE.SUCCESS,
        data: response[0], // Assuming you only expect one result
      });
    } else {
      res.status(404).send({
        message: `Cannot find subcategory with id=${id}.`,
      });
    }
  } catch (error) {
    res.status(StatusCode.SERVER_ERROR.code).send({
      message: error.message,
    });
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const { sub_category_name, movie_id } = req.body; // Remove created_on from the request body
    const subcategory = await subcategorytable.findByPk(id);
    if (!subcategory) {
      return res
        .status(404)
        .send({ message: `Subcategory with id=${id} not found.` });
    }
    await subcategory.update({
      sub_category_name,
      movie_id,
      // Add created_on with current timestamp directly to the updateData object
      created_on: new Date(),
    });
    RESPONSE.Success.Message = MESSAGE.UPDATE;
    RESPONSE.Success.data = {};
    res.status(StatusCode.OK.code).send(RESPONSE.Success);
  } catch (error) {
    RESPONSE.Failure.Message = error.message;
    res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.Failure);
  }
};

exports.delete = async (req, res) => {
  try {
    const sub_category_id = req.params.id;
    const data = { delete_status: 1 };
    console.log("sub_category_id : " + sub_category_id);
    const sub_category = await subcategorytable.findByPk(sub_category_id);

    if (!sub_category) {
      return res.status(404).json({ error: "subCategory not found" });
    }

    await sub_category.update(data);

    RESPONSE.Success.Message = MESSAGE.DELETE;
    RESPONSE.Success.data = {};
    res.status(StatusCode.OK.code).send(RESPONSE.Success);
  } catch (error) {
    RESPONSE.Failure.Message = error.message;
    res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.Failure);
  }
};

exports.getCategoryDropdown = async (req, res) => {
  try {
    const categories = await categorytable.findAll({
      attributes: {
        exclude: [
          "movie_id",
          "created_on",
          "updated_on",
          "active_status",
          "delete_status",
        ],
      },
      where: {
        active_status: 1,
        delete_status: 0,
      },
    });

    const categoryNames = categories.map((category) => ({
      category_id: category.category_id,
      category_name: category.category_name,
    }));

    RESPONSE.Success.Message = MESSAGE.SUCCESS;
    RESPONSE.Success.data = categoryNames;
    res.status(StatusCode.OK.code).send(RESPONSE.Success);
  } catch (error) {
    RESPONSE.Failure.Message = error.message;
    res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.Failure);
  }
};
