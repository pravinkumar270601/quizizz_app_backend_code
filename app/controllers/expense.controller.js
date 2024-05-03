const express = require("express");
const db = require("../models");
const expense = db.expensetracker_t_expense_t;
const subcategorytable = db.expensetracker_t_subcategory_m;
const movieschedule = db.expensetracker_t_movieschedule_t;
const crewtable = db.expensetracker_t_crew_m;
const { QueryTypes } = require("sequelize");
const RESPONSE = require("../constants/response");
const { MESSAGE } = require("../constants/message");
const { StatusCode } = require("../constants/HttpStatusCode");

// Create and save new subcategory
exports.createExpense = async (req, res) => {
  try {
    //create expense
    const data = {
      movie_id: req.body.movie_id,
      spot_id: req.body.spot_id,
      category_id: req.body.spot_id,
      sub_category_id: req.body.sub_category_id,
      crew_id: req.body.crew_id,
      advance_amount: req.body.advance_amount,
      beta: req.body.beta,
      no_of_staffs: req.body.no_of_staffs,
      created_on: req.body.created_on,
    };
    const response = await expense.create(data);

    //create movie schedule
    const shootingData = {
      movie_id: req.body.movie_id,
      spot_id: req.body.spot_id,
      date_of_shooting: req.body.date_of_shooting,
    };
    const result = await movieschedule.create(shootingData);

    RESPONSE.Success.Message = MESSAGE.SUCCESS;
    RESPONSE.Success.data = { expense_id: response.expense_id };
    res.status(StatusCode.CREATED.code).send(RESPONSE.Success);
  } catch (error) {
    console.log(error, "error");
    RESPONSE.Failure.Message = error.message;
    res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.Failure);
  }
};

// Retrieve all subcategories
exports.getExpenseDetails = async (req, res) => {
  try {
    const query = `
    SELECT e.expense_id,m.movie_name,s.location,sch.date_of_shooting,c.crew_name,cat.category_name,sub.sub_category_name,e.no_of_staffs,e.advance_amount,e.beta FROM expensetracker_t_expense_t as e 
left join expensetracker_t_movie_m as m on e.movie_id=m.movie_id 
left join expensetracker_t_shootingspot_m as s on e.spot_id = s.spot_id
left join expensetracker_t_movieschedule_t as sch on e.spot_id=sch.spot_id
left join expensetracker_t_crew_m as c on e.crew_id = c.crew_id
left join expensetracker_t_category_m as cat on e.category_id=cat.category_id
left join expensetracker_t_subcategory_m as sub on e.sub_category_id=sub.sub_category_id
WHERE e.active_status = 1 AND e.delete_status=0
GROUP by expense_id;
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

// Retrieve a single subcategory by ID
exports.getExpenseById = async (req, res) => {
  try {
    const expense_id = req.params.expense_id;
    const query = `
    SELECT e.expense_id,m.movie_name,s.location,sch.date_of_shooting,c.crew_name,cat.category_name,sub.sub_category_name,e.no_of_staffs,e.advance_amount,e.beta FROM expensetracker_t_expense_t as e 
    left join expensetracker_t_movie_m as m on e.movie_id=m.movie_id 
    left join expensetracker_t_shootingspot_m as s on e.spot_id = s.spot_id
    left join expensetracker_t_movieschedule_t as sch on e.spot_id=sch.spot_id
    left join expensetracker_t_crew_m as c on e.crew_id = c.crew_id
    left join expensetracker_t_category_m as cat on e.category_id=cat.category_id
    left join expensetracker_t_subcategory_m as sub on e.sub_category_id=sub.sub_category_id
    WHERE e.active_status = 1 AND e.delete_status = 0 AND e.expense_id = :expense_id;
    `;

    const response = await db.sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: { expense_id: expense_id },
    });
    RESPONSE.Success.Message = MESSAGE.SUCCESS;
    RESPONSE.Success.data = response;
    res.status(StatusCode.OK.code).send(RESPONSE.Success);
  } catch (error) {
    RESPONSE.Failure.Message = error.message;
    res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.Failure);
  }
};

// Update a subcategory
exports.updateExpense = async (req, res) => {
  try {
    // Update expense
    const expense_id = req.params.expense_id;
    const schedule_id = req.body.schedule_id;
    const updateData = {
      advance_amount: req.body.advance_amount,
      beta: req.body.beta,
      no_of_staffs: req.body.no_of_staffs,
      updated_on: req.body.updated_on,
    };
    const response = await expense.update(updateData, {
      where: { expense_id: expense_id },
    });

    // Update movie schedule
    const shootingData = {
      date_of_shooting: req.body.date_of_shooting,
    };
    const result = await movieschedule.update(shootingData, {
      where: { schedule_id: schedule_id },
    });

    RESPONSE.Success.Message = MESSAGE.UPDATE;
    RESPONSE.Success.data = {};
    res.status(StatusCode.OK.code).send(RESPONSE.Success);
  } catch (error) {
    console.log(error, "error");
    RESPONSE.Failure.Message = error.message;
    res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.Failure);
  }
};

exports.deleteExpenseAndSchedule = async (req, res) => {
  try {
    const { expense_id, schedule_id } = req.body;
    const expenseData = { delete_status: 1 };
    const scheduleData = { delete_status: 1 };

    // Delete expense
    const expenses = await expense.findByPk(expense_id);
    if (!expenses) {
      return res.status(404).json({ error: "Expense not found" });
    }
    const response = await expense.update(expenseData, {
      where: { expense_id: expense_id },
    });

    // Delete movie schedule
    const movieSchedule = await movieschedule.findByPk(schedule_id);
    if (!movieSchedule) {
      return res.status(404).json({ error: "Movie schedule not found" });
    }
    const result = await movieSchedule.update(scheduleData, {
      where: { schedule_id: schedule_id },
    });

    RESPONSE.Success.Message = MESSAGE.DELETE;
    RESPONSE.Success.data = {};
    res.status(StatusCode.OK.code).send(RESPONSE.Success);
  } catch (error) {
    console.log("error", error);
    RESPONSE.Failure.Message = error.message;
    res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.Failure);
  }
};

exports.getCrewDropDown = async (req, res) => {
  try {
    const crews = await crewtable.findAll({
      attributes: {
        exclude: [
          "category_id",
          "sub_category_id",
          "movie_id",
          "nationality",
          "gender",
          "mobile_no",
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

    RESPONSE.Success.Message = MESSAGE.SUCCESS;
    RESPONSE.Success.data = crews;
    res.status(StatusCode.OK.code).send(RESPONSE.Success);
  } catch (error) {
    RESPONSE.Failure.Message = error.message;
    res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.Failure);
  }
};
