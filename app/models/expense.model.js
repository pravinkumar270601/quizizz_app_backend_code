const moment = require("moment");

module.exports = (sequelize, Sequelize) => {
  const expense = sequelize.define("expensetracker_t_expense_t", {
    expense_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    movie_id: {
      type: Sequelize.INTEGER,
      references: {
        model: "expensetracker_t_movie_m",
        key: "movie_id",
      },
      allowNull: true,
    },
    spot_id: {
      type: Sequelize.INTEGER,
      references: {
        model: "expensetracker_t_shootingspot_m",
        key: "spot_id",
      },
      allowNull: false,
    },
    category_id: {
      type: Sequelize.INTEGER,
      references: {
        model: "expensetracker_t_category_m",
        key: "category_id",
      },
      allowNull: false,
    },
    sub_category_id: {
      type: Sequelize.INTEGER,
      references: {
        model: "expensetracker_t_subcategory_m",
        key: "sub_category_id",
      },
      allowNull: false,
    },
    crew_id: {
      type: Sequelize.INTEGER,
      references: {
        model: "expensetracker_t_crew_m",
        key: "crew_id",
      },
      allowNull: false,
    },
    date_of_shooting:{
      type: Sequelize.DATEONLY,
      allowNull:false

    },
    advance_amount: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    beta: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    no_of_staffs: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    active_status: {
      type: Sequelize.TINYINT,
      allowNull: true,
      defaultValue: 1,
    },
    delete_status: {
      type: Sequelize.TINYINT,
      alloweNull: true,
      defaultValue: 0,
    },
    created_on: {
      allowNull: true,
      type: Sequelize.DATEONLY,
      defaultValue: Sequelize.literal("CURRENT_DATE"), // set default value to current date
      get() {
        // Custom getter to format the date as required
        const rawValue = this.getDataValue("created_on");
        if (rawValue) {
          return moment(rawValue).format("DD MMM YYYY");
        }
        return null;
      },
    },
    updated_on: {
      allowNull: true,
      type: Sequelize.DATEONLY,
    },
  });

  return expense;
};
