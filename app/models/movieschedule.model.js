module.exports = (sequelize, Sequelize) => {
  const movieschedule = sequelize.define("expensetracker_t_movieschedule_t", {
    schedule_id: {
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
      allowNull: false,
    },
    spot_id: {
      type: Sequelize.INTEGER,
      references: {
        model: "expensetracker_t_shootingspot_m",
        key: 'spot_id'
    },
      allowNull: false,
    },
    date_of_shooting: {
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
  });

  return movieschedule;
};
