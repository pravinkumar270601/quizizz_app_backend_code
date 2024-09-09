module.exports = (sequelize, Sequelize) => {
  const Question_answer = sequelize.define("quiz_question_answer", {
    question_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    questionText: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    questionAudioUrl: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    questionVideoUrl: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    options: {
      type: Sequelize.JSON, // Store options as a JSON array
      allowNull: true,
    },
    optionsImageUrl: {
      type: Sequelize.JSON, // Store options as a JSON array
      allowNull: true,
    },
    correctAnswer: {
      type: Sequelize.JSON, // Store the correct option's value or index
      allowNull: false,
    },
    questionType: {
      type: Sequelize.JSON, // Store options as a JSON array
      allowNull: false,
    },
    questionPoint: {
      type: Sequelize.JSON, // Store options as a JSON array
      allowNull: false,
    },
    questionTiming: {
      type: Sequelize.JSON, // Store options as a JSON array
      allowNull: false,
    },
    publish_id: {
      type: Sequelize.INTEGER,
      allowNull: true, // Set to allow NULL values
      references: {
        model: "publish",
        key: "publish_id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL", // If the publish is deleted, set this field to NULL
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

  return Question_answer;
};
