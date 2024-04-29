const express = require("express");
const db = require("../models");
const categorytable = db.expensetracker_t_category_m;
const { QueryTypes } = require("sequelize");

const RESPONSE = require("../constants/response");
const { MESSAGE } = require("../constants/message");
const { StatusCode } = require("../constants/HttpStatusCode");

exports.create = async (req, res) => {
  try {
    const data = {
      category_name: req.body.category_name,
      movie_id: req.body.movie_id,
      created_on: req.body.created_on,
    };

    const response = await categorytable.create(data);

    RESPONSE.Success.Message = MESSAGE.SUCCESS;
    RESPONSE.Success.data = { category_id: response.category_id };
    res.status(StatusCode.CREATED.code).send(RESPONSE.Success);
  } catch (error) {
    RESPONSE.Failure.Message = error.message;
    res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.Failure);
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const query = `
      SELECT c.category_id, c.category_name, c.created_on, m.movie_name
      FROM expensetracker_t_category_m AS c
      LEFT JOIN expensetracker_t_movie_m AS m ON c.movie_id = m.movie_id
      WHERE c.active_status = 1;
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
    const id = req.params.id;
    const query = `
      SELECT c.category_id, c.category_name, c.created_on
      FROM expensetracker_t_category_m AS c
      LEFT JOIN expensetracker_t_movie_m AS m ON c.movie_id = m.movie_id
      WHERE c.category_id = :category_id AND c.active_status = 1;
    `;

    const response = await db.sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: { category_id: id },
    });

    if (response.length > 0) {
      RESPONSE.Success.Message = MESSAGE.SUCCESS;
      RESPONSE.Success.data = response[0];
      res.status(StatusCode.OK.code).send(RESPONSE.Success);
    } else {
      res.status(404).send({
        message: `Cannot find category with id=${id}.`,
      });
    }
  } catch (error) {
    RESPONSE.Failure.Message = error.message;
    res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.Failure);
  }
};

exports.update = async (req, res) => {
  try {
    const category_id = req.params.id;
    const { category_name, updated_on } = req.body;
    const category = await categorytable.findByPk(category_id);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    await category.update({
      category_name,
      updated_on,
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
    const category_id = req.params.id;
    const data = { delete_status: 1 };
    console.log("category_id : " + category_id);
    const category = await categorytable.findByPk(category_id);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    await category.update(data);

    RESPONSE.Success.Message = MESSAGE.DELETE;
    RESPONSE.Success.data = {};
    res.status(StatusCode.OK.code).send(RESPONSE.Success);
  } catch (error) {
    RESPONSE.Failure.Message = error.message;
    res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.Failure);
  }
};
