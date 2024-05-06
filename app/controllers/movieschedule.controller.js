const express = require("express");
const db = require("../models");
const expense = db.expensetracker_t_movieschedule_t;

const RESPONSE = require("../constants/response");
const { MESSAGE } = require("../constants/message");
const { StatusCode } = require("../constants/HttpStatusCode");

//create and save new movieschedule
exports.createSchedule = async (req, res, next) => {
  try {
    const data = {
      movie_id: req.body.movie_id,
      spot_id: req.body.spot_id,
      date_of_shooting: req.body.date_of_shooting,
    };
    const response = await expense.create(data);

    RESPONSE.Success.Message = MESSAGE.SUCCESS;
    RESPONSE.Success.data = { schedule_id: response.schedule_id };
    res.status(StatusCode.CREATED.code).send(RESPONSE.Success);
  } catch (error) {
    RESPONSE.Failure.Message = error.message;
    res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.Failure);
  }
};

// Retrieve all movieschedule from the database.
exports.getscheduleDetails = async (req, res) => {
  try {
    const response = await expense.findAll({
      where: {
        active_status: 1,
        delete_status: 0,
      },
      attributes: { exclude: ["active_status", "delete_status"] },
    });
    // console.log("response",response)

    RESPONSE.Success.Message = MESSAGE.SUCCESS;
    RESPONSE.Success.data = response;
    res.status(StatusCode.CREATED.code).send(RESPONSE.Success);
  } catch (error) {
    // RESPONSE.Success.data = {data:response};

    RESPONSE.Failure.Message = error.message;
    res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.Failure);
  }
};

// Find a single schedule with an schedule_id
exports.findOneschedule = async (req, res) => {
  try {
    const schedule_id = req.params.schedule_id;

    const response = await expense.findOne({
      where: {
        schedule_id: schedule_id,
      },
      attributes: { exclude: ["active_status", "delete_status"] },
    });

    if (!response) {
      RESPONSE.Failure.Message = "Expense not found";
      return res.status(StatusCode.NOT_FOUND.code).send(RESPONSE.Failure);
    }

    RESPONSE.Success.Message = MESSAGE.SUCCESS;
    RESPONSE.Success.data = response;
    res.status(StatusCode.CREATED.code).send(RESPONSE.Success);
  } catch (error) {
    RESPONSE.Failure.Message = error.message;
    res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.Failure);
  }
};

// Update a schedule by the schedule in the request
exports.updateschedule = async (req, res) => {
  try {
    const schedule_id = req.params.id;
    const { movie_id, spot_id, date_of_shooting } = req.body;
    const schedule = await expense.findByPk(schedule_id);
    if (!schedule) {
      return res.status(404).json({ error: "schedule not found" });
    }
    // Remove updated_on from the updateData object
    const updateData = {
      movie_id,
      spot_id,
      date_of_shooting,
      // Add updated_on with current timestamp directly to the updateData object
      updated_on: new Date(),
    };
    await schedule.update(updateData);
    RESPONSE.Success.Message = MESSAGE.UPDATE;
    RESPONSE.Success.data = {};
    res.status(StatusCode.CREATED.code).send(RESPONSE.Success);
  } catch (error) {
    RESPONSE.Failure.Message = error.message;
    res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.Failure);
  }
};


// Delete a schedule with the specified schedule_id in the request
exports.deleteschedule = async (req, res) => {
  try {
    const schedule_id = req.params.id;
    const data = { delete_status: 1 };
    console.log("schedule_id : " + schedule_id);
    const schedule = await expense.findByPk(schedule_id);

    if (!schedule) {
      return res.status(404).json({ error: "schedule not found" });
    }

    await schedule.update(data);

    RESPONSE.Success.Message = MESSAGE.DELETE;
    RESPONSE.Success.data = {};
    res.status(StatusCode.CREATED.code).send(RESPONSE.Success);
  } catch (error) {
    RESPONSE.Failure.Message = error.message;
    res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.Failure);
  }
};
