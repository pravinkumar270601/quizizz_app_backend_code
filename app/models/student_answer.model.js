module.exports = (sequelize, Sequelize) => {
  const StudentAnswer = sequelize.define("student_answer", {
    student_answer_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    student_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "student",
        key: "student_id",
      },
    },
    publish_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "publish",
        key: "publish_id",
      },
    },
    question_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "quiz_question_answer",
        key: "question_id",
      },
    },
    student_answer: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    attempt: {  // New field for storing attempt number
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  });

  return StudentAnswer;
};
