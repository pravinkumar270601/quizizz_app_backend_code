const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  define: {
    timestamps: false, //true: createdAt & updatedAt
    freezeTableName: true, //To avoid plurals while creating table name
  },
  operatorsAliases: 0,
  logging: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// db.tutorials = require("./tutorial.model.js")(sequelize, Sequelize);
db.expensetracker_t_category_m = require("./category.model.js")(sequelize, Sequelize);
db.expensetracker_t_subcategory_m = require("./subcategory.model.js")(sequelize, Sequelize);
db.expensetracker_t_crew_m = require("./crew.model.js")(sequelize, Sequelize);
db.expensetracker_t_movie_m = require("./movie.model.js")(sequelize, Sequelize);
db.expensetracker_t_movieschedule_t = require("./movieschedule.model.js")(sequelize, Sequelize);
db.expensetracker_t_shootingspot_m = require("./shootingspot.model.js")(sequelize, Sequelize);
db.expensetracker_t_expense_t = require("./expense.model.js")(sequelize, Sequelize);

module.exports = db;

// db.d_expensetracker_db= require('./subcategory.model.js')