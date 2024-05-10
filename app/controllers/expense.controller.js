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
    // Ensure date_of_shooting is provided
    // if (!req.body.date_of_shooting) {
    //   throw new Error("Date of shooting is required");
    // }

    // Create expense
    const expenseData = {
      movie_id: req.body.movie_id,
      spot_id: req.body.spot_id,
      category_id: req.body.category_id,
      sub_category_id: req.body.sub_category_id,
      crew_id: req.body.crew_id,
      advance_amount: req.body.advance_amount,
      beta: req.body.beta,
      no_of_staffs: req.body.no_of_staffs,
      created_on: req.body.created_on,
      date_of_shooting: req.body.date_of_shooting,
    };
    const expenseEntry = await expense.create(expenseData);
    console.log('expenseEntry', expenseEntry);

    // Create movie schedule
    const shootingData = {
      movie_id: req.body.movie_id,
      spot_id: req.body.spot_id,
      date_of_shooting: req.body.date_of_shooting,
      expense_id: expenseEntry?.expense_id
    };
    const scheduleEntry = await movieschedule.create(shootingData);

    RESPONSE.Success.Message = MESSAGE.SUCCESS;
    RESPONSE.Success.data = { expense_id: expenseEntry.expense_id };
    res.status(StatusCode.CREATED.code).send(RESPONSE.Success);
  } catch (error) {
    console.log(error, "error");
    RESPONSE.Failure.Message = error.message;
    res.status(StatusCode.BAD_REQUEST.code).send(RESPONSE.Failure);
  }
};



// Retrieve all subcategories
exports.getExpenseDetails = async (req, res) => {
  try {
    const query = `
   SELECT e.expense_id, m.movie_name, DATE_FORMAT(e.date_of_shooting, '%d %b %Y') AS Date, s.location, c.crew_name, cat.category_name, sub.sub_category_name, e.no_of_staffs, e.advance_amount, e.beta AS daily_beta
FROM expensetracker_t_expense_t AS e
LEFT JOIN expensetracker_t_movie_m AS m ON e.movie_id = m.movie_id 
LEFT JOIN expensetracker_t_shootingspot_m AS s ON e.spot_id = s.spot_id
LEFT JOIN expensetracker_t_movieschedule_t AS sch ON e.spot_id = sch.spot_id
LEFT JOIN expensetracker_t_crew_m AS c ON e.crew_id = c.crew_id
LEFT JOIN expensetracker_t_category_m AS cat ON e.category_id = cat.category_id
LEFT JOIN expensetracker_t_subcategory_m AS sub ON e.sub_category_id = sub.sub_category_id
WHERE e.active_status = 1 AND e.delete_status = 0
GROUP BY e.expense_id;

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
    SELECT e.expense_id,m.movie_id,s.spot_id,e.date_of_shooting,c.crew_id,cat.category_id,sub.sub_category_id,e.no_of_staffs,e.advance_amount,e.beta AS daily_beta FROM expensetracker_t_expense_t as e 
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
    const expense_id = req.params.expense_id
     
    const updateData = {
      movie_id: req.body.movie_id,
      spot_id: req.body.spot_id,
      category_id: req.body.category_id,
      sub_category_id: req.body.sub_category_id,
      crew_id: req.body.crew_id,
      advance_amount: req.body.advance_amount,
      beta: req.body.beta,
      no_of_staffs: req.body.no_of_staffs,
      date_of_shooting: req.body.date_of_shooting,

      // Remove updated_on from the updateData object
    };
    // Add updated_on with current timestamp directly to the updateData object
    updateData.updated_on = new Date();

    const response = await expense.update(updateData, {
      where: { expense_id: expense_id },
    });

    // Update movie schedule
    const shootingData = {
      movie_id: req.body.movie_id,
      spot_id: req.body.spot_id,
      date_of_shooting: req.body.date_of_shooting,
    };
    const result = await movieschedule.update(shootingData, {
      where: { expense_id: expense_id },
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
    //const { expense_id, schedule_id } = req.params;
    
    const scheduleData = { delete_status: 1 };
    const expense_id = req.params.expense_id;
    const expenseData = { delete_status: 1 };
   // const schedule_id = req.params.schedule_id;

    // Delete expense
    const expenses = await expense.findAll({
      where: {
        expense_id: expense_id
  }
  });
    if (!expenses) {
      return res.status(404).json({ error: "Expense not found" });
    }
    const response = await expense.update(expenseData, {
      where: { expense_id:expense_id},
    });

    // Delete movie schedule
    const movieSchedule = await movieschedule.findAll({
      where: {
        expense_id: expense_id,
      },
    });
    if (!movieSchedule) {
      return res.status(404).json({ error: "Movie schedule not found" });
    }
    const result = await movieschedule.update(scheduleData, {
      where: { expense_id: expense_id },
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
    // Assuming movie_id is provided in the request body or query parameters
    const movie_id = req.body.movie_id ;

    // Ensure movie_id is provided
    if (!movie_id) {
      throw new Error("Movie ID is required");
    }

    const crews = await crewtable.findAll({
      attributes: {
        exclude: [
          "category_id",
          "sub_category_id",
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
        movie_id: movie_id, // Filter crews by the specified movie_id
        active_status: 1,
        delete_status: 0,
      },
    });

    // Extract only crew_name from the crew objects
    const crewNames = crews.map((crew) => ({
      crew_id: crew.crew_id,
      crew_name: crew.crew_name,
    }));

    RESPONSE.Success.Message = MESSAGE.SUCCESS;
    RESPONSE.Success.data = crewNames;
    res.status(StatusCode.OK.code).send(RESPONSE.Success);
  } catch (error) {
    RESPONSE.Failure.Message = error.message;
    res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.Failure);
  }
};

