module.exports = (sequelize, Sequelize) => {
  const Publish = sequelize.define("publish", {
    publish_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    subject: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    grade: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    language: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    visibilityType: {
      // Sequelize.ENUM("public", "private"),
      type: Sequelize.STRING,
      allowNull: false,
    },
    imageUrl: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    user_id: {
      type: Sequelize.INTEGER,
      references: {
        model: "user",
        key: "user_id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      allowNull: false,
    },
  });
  return Publish;
};
