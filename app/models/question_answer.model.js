module.exports = (sequelize, Sequelize) => {
  const Question_answer = sequelize.define("quiz_question_answer", {
    question_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    questionText: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    options: {
      type: Sequelize.JSON, // Store options as a JSON array
      allowNull: false,
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
    user_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'user_id',
      },
      allowNull: false,
    },
  });

  return Question_answer;
};
