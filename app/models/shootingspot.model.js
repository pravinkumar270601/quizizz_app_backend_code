module.exports = (sequelize, Sequelize) => {
  const expense = sequelize.define("expensetracker_t_shootingspot_m", {
    spot_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    movie_id: {
      type: Sequelize.INTEGER,
      references: {
        model: "expensetracker_t_movie_m",
        key: 'movie_id'
    },
      allowNull: true,
      
    },
    contact_no: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    location: {
      type: Sequelize.STRING,
      allowNull: true,
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
    },
    updated_on: {
      allowNull: true,
      type: Sequelize.DATEONLY,
    },
  });

  return expense;
};
