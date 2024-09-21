const Sequelize = require("sequelize");
const db = require("../models");
const Staff = db.staffs;
const Access = db.accesses;

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
      staff_id: req.body.staff_id,
      question_ids: req.body.question_ids || [],
      access_granted_toaccess_granted_to: req.body.access_granted_to || [], // Array of student IDs
    };
    // const {staff_id } = req.body;
    if (!data.staff_id) {
      return res.status(400).send({ message: "staff ID is required" });
    }
    if (!data.question_ids || data.question_ids.length === 0) {
      return res
        .status(400)
        .send({ message: "At least one question ID is required" });
    }
    // Check if the staff exists
    const existingStaff = await Staff.findByPk(data.staff_id);

    if (!existingStaff) {
      return res.status(400).send({ message: "staff does not exist" });
    }

    // Check if all question IDs belong to the same staff
    const staffQuestions = await QuestionAnswersTable.findAll({
      where: {
        question_id: data.question_ids,
        staff_id: data.staff_id,
      },
    });

    if (staffQuestions.length !== data.question_ids.length) {
      return res.status(400).send({
        message:
          "One or more question IDs do not belong to the specified staff",
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

// Find a publish with a staffId

exports.getPublishByStaffId = async (req, res) => {
  try {
    const id = req.params.staff_id;
    const response = await PublishTable.findAll({ where: { staff_id: id } });

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

// In your publish controller file
// In your publish controller file
exports.grantAccessToStudent = async (req, res) => {
  const { publish_id, staff_id, student_id } = req.body; // Expecting these in the body

  try {
    // Find the publish record by publish_id and staff_id
    const publish = await PublishTable.findOne({
      where: { publish_id, staff_id },
    });

    if (!publish) {
      return res
        .status(404)
        .json({ message: "Publish not found or staff ID does not match." });
    }

    // Parse the existing access array, if it exists
    let accessGrantedTo = publish.access_granted_to
      ? JSON.parse(publish.access_granted_to)
      : [];

    // Check if the student already has access
    if (accessGrantedTo.includes(student_id)) {
      return res
        .status(400)
        .json({ message: "Access already granted to this student" });
    }

    // Grant access by adding the student_id to the array
    accessGrantedTo.push(student_id);

    // Update the publish with the new access array
    await PublishTable.update(
      { access_granted_to: JSON.stringify(accessGrantedTo) }, // Convert back to JSON string
      { where: { publish_id, staff_id } } // Ensure you update the correct entry
    );

    res.status(200).json({ message: "Access granted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// In your publish controller file

exports.grantAccessToStudent = async (req, res) => {
  const { publish_id, staff_id, student_id } = req.body;

  try {
    // Find the publish record by publish_id and staff_id
    const publish = await PublishTable.findOne({ where: { publish_id, staff_id } });
    
    if (!publish) {
      return res.status(404).json({ message: 'Publish not found or staff ID does not match.' });
    }

    // Log the current value for debugging
    console.log('Current access_granted_to:', publish.access_granted_to);

    // Initialize accessGrantedTo
    let accessGrantedTo = publish.access_granted_to ? JSON.parse(publish.access_granted_to) : [];

    // Ensure accessGrantedTo is an array
    if (!Array.isArray(accessGrantedTo)) {
      accessGrantedTo = [];
    }

    // Check if the student already has access
    if (accessGrantedTo.includes(student_id)) {
      return res.status(400).json({ message: 'Access already granted to this student' });
    }

    // Grant access by adding the student_id to the array
    accessGrantedTo.push(student_id);

    // Update the publish with the new access array
    await PublishTable.update(
      { access_granted_to: accessGrantedTo },
      // { access_granted_to: JSON.stringify(accessGrantedTo) },
      { where: { publish_id, staff_id } }
    );

    res.status(200).json({ message: 'Access granted successfully' });
  } catch (error) {
    console.error('Error in grantAccessToStudent:', error); // Log the error for debugging
    res.status(500).json({ message: error.message });
  }
};



// Get publishes by student_id
exports.getPublishByStudentId = async (req, res) => {
  const { student_id } = req.params;

  try {
    const publishes = await PublishTable.findAll({
      where: Sequelize.where(
        Sequelize.fn(
          "JSON_CONTAINS",
          Sequelize.col("access_granted_to"),
          student_id
        ),
        1
      ),
    });

// 1: Indicates that the specified value (in this case, student_id) exists in the JSON array.
// 0: Indicates that the value does not exist in the JSON array.

    if (publishes.length === 0) {
      return res
        .status(404)
        .json({ message: "No publishes found for this student" });
    }

    res.status(200).json(publishes);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
