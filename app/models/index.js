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
db.quiz_question_answers = require("./question_answer.model.js")(sequelize, Sequelize)
db.publishs = require("./publish_user.model.js")(sequelize, Sequelize)
db.users = require("./user.model.js")(sequelize, Sequelize)
// Establish relationships


module.exports = db;

// db.d_expensetracker_db= require('./subcategory.model.js')
