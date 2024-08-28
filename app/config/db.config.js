module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "",
  DB: "d_quizizz_app_mysql_db",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
