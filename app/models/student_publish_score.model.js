module.exports = (sequelize, Sequelize) => {
  const StudentPublishScore = sequelize.define("student_publish_score", {
    student_publish_score_id: {
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
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    publish_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "publish",
        key: "publish_id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    attempt: {
      type: Sequelize.INTEGER, // Number of attempts
      allowNull: false,
    },
    score: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "pending", // Default status
    },
    total_questions: {
      type: Sequelize.INTEGER, // Total number of questions in the publish
      allowNull: false,
    },
    correct_answers: {
      type: Sequelize.INTEGER, // Number of correct answers the student provided
      allowNull: false,
    },
    student_answer_ids: {
      type: Sequelize.TEXT, // Storing the student_answer_ids as a JSON array string
      allowNull: false,
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

  return StudentPublishScore;
};
