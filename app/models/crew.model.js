module.exports = (sequelize, Sequelize) => {
  const crew = sequelize.define("expensetracker_t_crew_m", {
    crew_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    crew_name: {
      type: Sequelize.STRING,
      allowNull: true,
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
      allowNull: true,
    },
    movie_id: {
      type: Sequelize.INTEGER,
      references: {
        model: "expensetracker_t_movie_m",
        key: "movie_id",
      },
      allowNull: true,
    },
    mobile_no: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    gender: {
      type: Sequelize.TINYINT,
      allowNull: true,
      comment: "1-> male, 2-> female, 3-> others",
    },

    active_status: {
      type: Sequelize.TINYINT,
      allowNull: true,
      defaultValue: 1,
    },
    delete_status: {
      type: Sequelize.TINYINT,
      allowNull: true,
      defaultValue: 0,
    },
    created_on: {
      allowNull: true,
      type: Sequelize.DATEONLY,
      // defaultValue: Sequelize.literal("CURRENT_DATE"), // set default value to current date
      // get() {
      //   // Custom getter to format the date as required
      //   const rawValue = this.getDataValue("created_on");
      //   if (rawValue) {
      //     return moment(rawValue).format("DD MMM YYYY");
      //   }
      //   return null;
      // },
    },
    updated_on: {
      type: Sequelize.DATEONLY,
      allowNull: true,
    },
  });

  return crew;
};
