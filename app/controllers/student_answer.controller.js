const Sequelize = require("sequelize");
const db = require("../models");
const PublishTable = db.publishs;
const StudentAnswer = db.student_answers;
const QuestionAnswersTable = db.quiz_question_answers;
const StudentPublishScoreTable = db.student_publish_scores;

// const { StudentPublishScore, StudentAnswer, QuizQuestionAnswer } = require("../models");

const RESPONSE = require("../constants/response");
const { MESSAGE } = require("../constants/message");
const { StatusCode } = require("../constants/HttpStatusCode");

exports.storeStudentAnswer = async (req, res) => {
  const { student_id, publish_id, answers } = req.body;

  if (
    !student_id ||
    !publish_id ||
    !Array.isArray(answers) ||
    answers.length === 0
  ) {
    return res.status(400).json({ message: "Invalid request data" });
  }

  try {
    // Step 1: Check for existing attempts for this student and publish
    const lastAttempt = await StudentAnswer.findOne({
      where: { student_id, publish_id },
      order: [["attempt", "DESC"]], // Get the latest attempt
    });

    // Determine the current attempt
    const currentAttempt = lastAttempt ? lastAttempt.attempt + 1 : 1;
    // console.log(currentAttempt, "currentAttempt");

    const studentAnswerIds = [];

    // Step 2: Iterate over the answers and save each one
    for (const answer of answers) {
      const { question_id, student_answer } = answer;

      // Create the student answer record
      const studentAnswer = await StudentAnswer.create({
        student_id,
        publish_id,
        question_id,
        student_answer,
        attempt: currentAttempt, // Assign the current attempt number
      });

      studentAnswerIds.push(studentAnswer.student_answer_id); // Store the IDs of saved answers
    }

    // res.status(200).json({
    //   message: "Student answers stored successfully",
    //   student_answer_ids: studentAnswerIds,
    //   attempt: currentAttempt,
    // });
    RESPONSE.Success.Message = "Student answers stored successfully";
    RESPONSE.Success.data = {
      student_answer_ids: studentAnswerIds,
      attempt: currentAttempt,
    };
    res.status(200).send(RESPONSE.Success);
  } catch (error) {
    console.error("Error storing student answers:", error);
    res
      .status(500)
      .json({ message: "An error occurred while storing the answers." });
  }
};

exports.getAttemptsWithAnswers = async (req, res) => {
  const { student_id, publish_id } = req.params;

  try {
    // Step 1: Retrieve all attempts for the given student_id and publish_id
    const attempts = await StudentPublishScoreTable.findAll({
      where: { student_id, publish_id },
      order: [["attempt", "ASC"]], // Order attempts in ascending order
    });

    if (attempts.length === 0) {
      return res
        .status(404)
        .json({ message: "No attempts found for this student and publish." });
    }

    // Step 2: Retrieve all questions based on publish_id
    const questions = await QuestionAnswersTable.findAll({
      where: { publish_id },
    });

    // Step 3: Map through attempts and get corresponding answers
    const responseData = await Promise.all(
      attempts.map(async (attempt) => {
        // Fetch answers for the current attempt
        const studentAnswers = await StudentAnswer.findAll({
          where: {
            student_id,
            publish_id,
            attempt: attempt.attempt, // Match the attempt number
          },
        });

        // Map over questions to include student answers
        const originalQuestionsWithAnswers = questions.map((question) => {
          // Filter answers for the current question
          const studentAnswersForQuestion = studentAnswers.filter(
            (answer) => answer.question_id === question.question_id
          );

          return {
            ...question.dataValues, // spread the question data
            student_answers: studentAnswersForQuestion,
          };
        });

        return {
          student_publish_score_id: attempt.student_publish_score_id,
          attempt: attempt.attempt,
          score: attempt.score,
          student_id: attempt.student_id,
          publish_id: attempt.publish_id,
          original_question_answers: originalQuestionsWithAnswers,
        };
      })
    );

    // Step 4: Return the structured response
    RESPONSE.Success.Message = "Attempts and answers retrieved successfully";
    RESPONSE.Success.data = responseData
    res.status(200).send(RESPONSE.Success);
    // res.status(200).json({
    //   message: "Attempts and answers retrieved successfully",
    //   data: responseData,
    // });
  } catch (error) {
    console.error("Error retrieving attempts and answers:", error);
    res
      .status(500)
      .json({
        message: "An error occurred while retrieving attempts and answers.",
      });
  }
};
