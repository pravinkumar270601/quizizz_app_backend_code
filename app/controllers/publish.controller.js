const Sequelize = require("sequelize");
const db = require("../models");
const User = db.users;

const PublishTable = db.publishs;
const QuestionAnswersTable = db.quiz_question_answers;

const RESPONSE = require("../constants/response");
const { MESSAGE } = require("../constants/message");
const { StatusCode } = require("../constants/HttpStatusCode");

// create publish
exports.PublishTableCreate = async (req, res) => {
  try {
    const data = {
      name: req.body.name,
      subject: req.body.subject,
      grade: req.body.grade,
      language: req.body.language,
      visibilityType: req.body.visibilityType,
      imageUrl: req.body.imageUrl,
      user_id: req.body.user_id,
      question_ids: req.body.question_ids || [],
    };
    // const {user_id } = req.body;
    if (!data.user_id) {
      return res.status(400).send({ message: "User ID is required" });
    }
    if (!data.question_ids || data.question_ids.length === 0) {
      return res
        .status(400)
        .send({ message: "At least one question ID is required" });
    }
    // Check if the user exists
    const existingUser = await User.findByPk(data.user_id);

    if (!existingUser) {
      return res.status(400).send({ message: "User does not exist" });
    }

    // Check if all question IDs belong to the same user
    const userQuestions = await QuestionAnswersTable.findAll({
      where: {
        question_id: data.question_ids,
        user_id: data.user_id,
      },
    });

    if (userQuestions.length !== data.question_ids.length) {
      return res.status(400).send({
        message: "One or more question IDs do not belong to the specified user",
      });
    }

    const response = await PublishTable.create(data);

    // Update quiz_question_answer entries with the new publish_id
    await QuestionAnswersTable.update(
      { publish_id: response.publish_id },
      { where: { question_id: data.question_ids } }
    );

    RESPONSE.Success.Message = MESSAGE.SUCCESS;
    RESPONSE.Success.data = { publish_id: response.publish_id };
    res.status(StatusCode.CREATED.code).send(RESPONSE.Success);
  } catch (error) {
    RESPONSE.Failure.Message = error.message;
    res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.Failure);
  }
};

// Retrieve all publish from the database.

exports.getAllPublish = async (req, res) => {
  try {
    const response = await PublishTable.findAll();

    RESPONSE.Success.Message = MESSAGE.SUCCESS;
    RESPONSE.Success.data = response;
    res.status(StatusCode.CREATED.code).send(RESPONSE.Success);
  } catch (error) {
    RESPONSE.Failure.Message = error.message;
    res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.Failure);
  }
};

// Find a single publish with a publish_id

exports.getPublishById = async (req, res) => {
  try {
    const id = req.params.publish_id;
    const response = await PublishTable.findByPk(id);

    if (response) {
      RESPONSE.Success.Message = MESSAGE.SUCCESS;
      RESPONSE.Success.data = response;
      res.status(StatusCode.CREATED.code).send(RESPONSE.Success);
    } else {
      res.status(404).send({ message: `Cannot find publish with id=${id}.` });
    }
  } catch (error) {
    RESPONSE.Failure.Message = error.message;
    res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.Failure);
  }
};


// Find a publish with a UserId

exports.getPublishByUserId = async (req, res) => {
  try {
    const id = req.params.user_id;
    const response = await PublishTable.findAll({ where: { user_id: id } });

    if (response) {
      RESPONSE.Success.Message = MESSAGE.SUCCESS;
      RESPONSE.Success.data = response;
      res.status(StatusCode.CREATED.code).send(RESPONSE.Success);
    } else {
      res.status(404).send({ message: `Cannot find publish with id=${id}.` });
    }
  } catch (error) {
    RESPONSE.Failure.Message = error.message;
    res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.Failure);
  }
};

// Update a publish by the publish_id in the request

exports.updatepublishById = async (req, res) => {
  try {
    const id = req.params.id;
    const [updated] = await PublishTable.update(req.body, {
      where: { publish_id: id },
    });

    if (updated) {
      const updatedPublish = await PublishTable.findByPk(id);
      RESPONSE.Success.Message = MESSAGE.UPDATE;
      RESPONSE.Success.data = {};
      res.status(StatusCode.CREATED.code).send(RESPONSE.Success);
    } else {
      return res.status(404).json({ error: "publish not found" });
    }
  } catch (error) {
    RESPONSE.Failure.Message = error.message;
    res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.Failure);
  }
};

// Delete a publish with the specified publish_id in the request
exports.deletepublishById = async (req, res) => {
  try {
    const id = req.params.id;

    // Delete related quiz_question_answer entries
    await QuestionAnswersTable.destroy({
      where: { publish_id: id },
    });

    const deleted = await PublishTable.destroy({
      where: { publish_id: id },
    });

    if (deleted) {
      RESPONSE.Success.Message = MESSAGE.DELETE;
      RESPONSE.Success.data = {};
      res.status(200).send(RESPONSE.Success);
    } else {
      return res.status(404).json({ error: "publish not found" });
    }
  } catch (error) {
    RESPONSE.Failure.Message = error.message;
    res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.Failure);
  }
};

// ---------------------- delete the old image code from chatgpt -----
// const fs = require('fs');
// const path = require('path');
// const db = require('../models');
// const Publish = db.publish;

// // Update a publish entry with a new image
// exports.updatePublishWithImage = async (req, res) => {
//     try {
//         const publishId = req.params.id;
//         const newImagePath = req.body.imageUrl;  // This is the new image path from the upload API

//         // Find the existing publish entry
//         const publish = await Publish.findByPk(publishId);
//         if (!publish) {
//             return res.status(404).send({ message: 'Publish entry not found' });
//         }

//         // Get the old image path
//         const oldImagePath = publish.imageUrl;

//         // Delete the old image from the server
//         if (oldImagePath) {
//             const oldImageFullPath = path.join(__dirname, '..', oldImagePath);
//             fs.unlink(oldImageFullPath, (err) => {
//                 if (err) {
//                     console.error('Failed to delete old image:', err);
//                 } else {
//                     console.log('Old image deleted successfully');
//                 }
//             });
//         }

//         // Update the publish entry with the new image URL
//         publish.imageUrl = newImagePath;
//         await publish.save();

//         res.send({ message: 'Publish entry updated successfully', publish });
//     } catch (error) {
//         res.status(500).send({ message: error.message });
//     }
// };
