const Sequelize = require("sequelize");
const db = require("../models");
const User = db.users;

const QuestionAnswersTable = db.quiz_question_answers;

const RESPONSE = require("../constants/response");
const { MESSAGE } = require("../constants/message");
const { StatusCode } = require("../constants/HttpStatusCode");

exports.QuestionAnswerscreate = async (req, res) => {
  try {
    const data = {
      questionText: req.body.questionText,
      questionAudioUrl: req.body.questionAudioUrl,
      questionVideoUrl: req.body.questionVideoUrl,
      options: req.body.options, // Expecting an array of options
      optionsImageUrl: req.body.optionsImageUrl,
      correctAnswer: req.body.correctAnswer, // Store the correct option's value or index
      questionType: req.body.questionType,
      questionPoint: req.body.questionPoint,
      questionTiming: req.body.questionTiming,
      user_id: req.body.user_id, // Associate with a user
    };

    const response = await QuestionAnswersTable.create(data);

    RESPONSE.Success.Message = MESSAGE.SUCCESS;
    RESPONSE.Success.data = { question_id: response.question_id };
    res.status(StatusCode.CREATED.code).send(RESPONSE.Success);
  } catch (error) {
    RESPONSE.Failure.Message = error.message;
    res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.Failure);
  }
};

// Retrieve all QuestionAnswers from the database.

// exports.getAllQuestionAnswers = async (req, res) => {
//   try {
//     const response = await QuestionAnswersTable.findAll();

//     RESPONSE.Success.Message = MESSAGE.SUCCESS;
//     RESPONSE.Success.data = response;
//     res.status(StatusCode.CREATED.code).send(RESPONSE.Success);
//   } catch (error) {
//     RESPONSE.Failure.Message = error.message;
//     res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.Failure);
//   }
// };

// Retrieve all questions by user ID
exports.getAllQuestionAnswersByPublishId = async (req, res) => {
  try {
    const publish_id = req.params.publish_id;
    const response = await QuestionAnswersTable.findAll({
      where: { publish_id },
    });

    if (response.length > 0) {
      RESPONSE.Success.Message = MESSAGE.SUCCESS;
      RESPONSE.Success.data = response;
      res.status(StatusCode.CREATED.code).send(RESPONSE.Success);
    } else {
      res
        .status(404)
        .send({ message: `No questions found for user_id=${user_id}` });
    }
  } catch (error) {
    RESPONSE.Failure.Message = error.message;
    res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.Failure);
  }
};

// Retrieve all questions where publish_id is null based on user_id
exports.getQuestionsWithoutPublishByUserId = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    if (!user_id) {
      return res.status(400).send({ message: "User ID is required" });
    }
    const existingUser = await User.findByPk(user_id);

    if (!existingUser) {
      return res.status(400).send({ message: "User does not exist" });
    }
    const response = await QuestionAnswersTable.findAll({
      where: {
        user_id: user_id,
        publish_id: null,
      },
    });

    if (response.length > 0) {
      RESPONSE.Success.Message = MESSAGE.SUCCESS;
      RESPONSE.Success.data = response;
      res.status(StatusCode.OK.code).send(RESPONSE.Success);
    } else {
      res
        .status(StatusCode.OK.code)
        .send({ message: "No questions found without a publish." });
    }
  } catch (error) {
    RESPONSE.Failure.Message = error.message;
    res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.Failure);
  }
};

// Find a single QuestionAnswers with a question_id

exports.getQuestionAnswersById = async (req, res) => {
  try {
    const id = req.params.id;
    const response = await QuestionAnswersTable.findByPk(id);

    if (response) {
      RESPONSE.Success.Message = MESSAGE.SUCCESS;
      RESPONSE.Success.data = response;
      res.status(StatusCode.CREATED.code).send(RESPONSE.Success);
    } else {
      res.status(404).send({ message: `Cannot find Question with id=${id}.` });
    }
  } catch (error) {
    RESPONSE.Failure.Message = error.message;
    res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.Failure);
  }
};

// Update a QuestionAnswers by the question_id in the request

exports.updateQuestionAnswersById = async (req, res) => {
  try {
    const id = req.params.id;
    const [updated] = await QuestionAnswersTable.update(req.body, {
      where: { question_id: id },
    });

    if (updated) {
      const updatedQuestion = await QuestionAnswersTable.findByPk(id);
      RESPONSE.Success.Message = MESSAGE.UPDATE;
      RESPONSE.Success.data = {};
      res.status(StatusCode.CREATED.code).send(RESPONSE.Success);
    } else {
      return res.status(404).json({ error: "QuestionAnswers not found" });
    }
  } catch (error) {
    RESPONSE.Failure.Message = error.message;
    res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.Failure);
  }
};

// Delete a QuestionAnswers with the specified question_id in the request
exports.deleteQuestionById = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await QuestionAnswersTable.destroy({
      where: { question_id: id },
    });

    if (deleted) {
      RESPONSE.Success.Message = MESSAGE.DELETE;
      RESPONSE.Success.data = {};
      res.status(200).send(RESPONSE.Success);
    } else {
      return res.status(404).json({ error: "QuestionAnswers not found" });
    }
  } catch (error) {
    RESPONSE.Failure.Message = error.message;
    res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.Failure);
  }
};

// delete all questions where publish_id is null based on user_id
exports.deleteQuestionsWithoutPublishByUserId = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    if (!user_id) {
      return res.status(400).send({ message: "User ID is required" });
    }
    const existingUser = await User.findByPk(user_id);

    if (!existingUser) {
      return res.status(400).send({ message: "User does not exist" });
    }
    const response = await QuestionAnswersTable.destroy({
      where: {
        user_id: user_id,
        publish_id: null,
      },
    });

    if (response > 0) {
      RESPONSE.Success.Message = `${response} questions deleted successfully.`;
      RESPONSE.Success.data = {};
      res.status(StatusCode.OK.code).send(RESPONSE.Success);
    } else {
      res
        .status(StatusCode.OK.code)
        .send({ message: "No questions found without a publish." });
    }
  } catch (error) {
    RESPONSE.Failure.Message = error.message;
    res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.Failure);
  }
};
