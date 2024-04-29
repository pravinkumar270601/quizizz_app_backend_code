module.exports = (sequelize, Sequelize) => {
  const expense = sequelize.define("expensetracker_t_movie_m", {
    movie_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    movie_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    active_status: {
      type: Sequelize.TINYINT,
      allowNull: false,
      defaultValue: 1,
    },
    delete_status: {
      type: Sequelize.TINYINT,
      alloweNull: false,
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

  return expense;
};
