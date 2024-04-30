module.exports = (sequelize, Sequelize) => {
  const subcategory = sequelize.define("expensetracker_t_subcategory_m", {
    sub_category_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    category_id: {
      type: Sequelize.INTEGER,
      references: {
        model: "expensetracker_t_category_m",
        key: "category_id",
      },
      allowNull: true,
    },
    movie_id: {
      type: Sequelize.INTEGER,
      references: {
        model: "expensetracker_t_movie_m",
        key: "movie_id",
      },
      allowNull: false,
    },
    sub_category_name: {
      type: Sequelize.STRING,
      allowNull: false,
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
    },
    updated_on: {
      allowNull: true,
      type: Sequelize.DATEONLY,
    },
  });

  return subcategory;
};
