module.exports = (sequelize, Sequelize) => {
  const category = sequelize.define("expensetracker_t_category_m", {
    category_id: {
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
      allowNull: false,
    },
    category_name: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    created_on: {
      allowNull: true,
      type: Sequelize.DATEONLY,
    },
    updated_on: {
      allowNull: true,
      type: Sequelize.DATEONLY,
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
  });

  return category;
};
