const Sequelize = require("sequelize");
const db = require("../models");
const StudentPublishScoreTable = db.student_publish_scores;
const StudentAnswer = db.student_answers;
const PublishTable = db.publishs;
const RESPONSE = require("../constants/response");
const { MESSAGE } = require("../constants/message");
const { StatusCode } = require("../constants/HttpStatusCode");

// In your student controller file
// exports.submitStudentScore = async (req, res) => {
//   const { student_id, publish_id, score, status } = req.body;

//   try {
//     // Find the StudentPublishScore entry
//     const studentScore = await StudentPublishScoreTable.findOne({
//       where: { student_id, publish_id },
//     });

//     if (!studentScore) {
//       return res
//         .status(404)
//         .json({ message: "StudentPublishScore entry not found" });
//     }

//     // Update the score and status using Sequelize's update method
//     await StudentPublishScoreTable.update(
//       { score, status }, // Fields to update
//       { where: { student_id, publish_id } } // Where condition
//     );

//     res.status(200).json({ message: "Score and status updated successfully" });
//   } catch (error) {
//     console.error("Error in submitStudentScore:", error); // Log the error for debugging
//     res.status(500).json({ message: error.message });
//   }
// };
// const { StudentAnswer, StudentPublishScore } = require("../models");

exports.submitStudentScore = async (req, res) => {
  const {
    student_id,
    publish_id,
    score,
    status,
    total_questions,
    correct_answers,
    student_answer_ids,
  } = req.body;

  try {
    // Step 1: Retrieve the latest attempt from StudentPublishScore for this student and publish
    const lastAttemptRecord = await StudentAnswer.findOne({
      where: { student_id, publish_id },
      order: [["attempt", "DESC"]], // Order by attempt in descending order to get the latest attempt
    });

    // If a record exists, get the last attempt value, else set the attempt to 1
    const currentAttempt = lastAttemptRecord ? lastAttemptRecord.attempt : 1;

    // Step 2: Check if the student already has a score entry for the given publish
    const existingScores = await StudentPublishScoreTable.findAll({
      where: { student_id, publish_id },
    });

    if (existingScores.length === 1 && existingScores[0].status === "pending") {
      // If there's exactly one existing score, update it
      const existingScore = existingScores[0];
      await existingScore.update({
        score,
        status,
        total_questions,
        correct_answers,
        student_answer_ids: JSON.stringify(student_answer_ids), // Store the student_answer_ids as a JSON string
        attempt: currentAttempt, // Use the current attempt number from the latest StudentAnswer
      });

      RESPONSE.Success.Message = "Score updated successfully";
      RESPONSE.Success.data = {
        attempt: currentAttempt,
        studentPublishScore: existingScore,
      };
      res.status(200).send(RESPONSE.Success);

      // res.status(200).json({
      //   message: "Score updated successfully",
      //   attempt: currentAttempt,
      //   studentPublishScore: existingScore,
      // });
    } else {
      // If there are no records or more than one, create a new entry
      const studentPublishScore = await StudentPublishScoreTable.create({
        student_id,
        publish_id,
        attempt: currentAttempt, // Assign the current attempt number
        score,
        status,
        total_questions,
        correct_answers,
        student_answer_ids: JSON.stringify(student_answer_ids), // Store the student_answer_ids as a JSON string
      });

      RESPONSE.Success.Message = "New score entry created successfully";
      RESPONSE.Success.data = { attempt: currentAttempt, studentPublishScore };
      res.status(201).send(RESPONSE.Success);

      // res.status(200).json({
      //   message: "New score entry created successfully",
      //   attempt: currentAttempt,
      //   studentPublishScore,
      // });
    }
  } catch (error) {
    console.error("Error storing or updating student publish score:", error);
    res
      .status(500)
      .json({ message: "An error occurred while processing the score." });
  }
};

// In your student controller file
// exports.getAllPublishesWithStudentScore = async (req, res) => {
//     const { student_id } = req.params;

//     try {
//       // Fetch all publishes with corresponding student scores for the provided student_id
//       const publishes = await PublishTable.findAll({
//         include: [
//           {
//             model: StudentPublishScoreTable,
//             as: 'studentScores',  // Alias for the association
//             where: { student_id }, // Filter by student_id
//             required: false,  // Allow publishes without a score entry
//           },
//         ],
//       });

//       if (!publishes || publishes.length === 0) {
//         return res.status(404).json({ message: "No publishes found for this student." });
//       }

//       res.status(200).json(publishes);
//     } catch (error) {
//       console.error('Error in getAllPublishesWithStudentScore:', error);
//       res.status(500).json({ message: error.message });
//     }
//   };

exports.getAllPublishesWithStudentScore = async (req, res) => {
  const { student_id } = req.params;

  try {
    // Fetch all publishes that grant access to the specified student_id,
    // and include the corresponding student scores
    const publishes = await PublishTable.findAll({
      where: Sequelize.where(
        Sequelize.fn(
          "JSON_CONTAINS",
          Sequelize.col("access_granted_to"),
          student_id // Ensure the student_id is stringified for JSON comparison
        ),
        1
      ),
      include: [
        {
          model: StudentPublishScoreTable,
          as: "studentScores", // Alias for the association
          where: { student_id }, // This will still filter by student_id in the scores table
          required: false, // Allow publishes without a score entry
        },
      ],
    });

    if (!publishes || publishes.length === 0) {
      return res
        .status(200)
        .json({ message: "No publishes found for this student." });
    }

    RESPONSE.Success.Message = MESSAGE.SUCCESS;
    RESPONSE.Success.data = publishes;
    res.status(200).send(RESPONSE.Success);

    // res.status(200).json(publishes);
  } catch (error) {
    console.error("Error in getAllPublishesWithStudentScore:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getStudentReportsForStaff = async (req, res) => {
  const { student_id, staff_id } = req.params; // Assuming both are passed in params

  try {
    // Fetch all publishes that grant access to the specified student_id and match the staff_id
    const publishes = await PublishTable.findAll({
      where: {
        staff_id, // Ensure it matches the specified staff_id
        [Sequelize.Op.and]: Sequelize.where(
          Sequelize.fn(
            "JSON_CONTAINS",
            Sequelize.col("access_granted_to"),
            student_id // Ensure the student_id is stringified for JSON comparison
          ),
          1
        ),
      },
      include: [
        {
          model: StudentPublishScoreTable,
          as: "studentScores", // Alias for the association
          where: { student_id }, // Filter by student_id in the scores table
          required: false, // Allow publishes without a score entry
        },
      ],
    });

    if (!publishes || publishes.length === 0) {
      return res
        .status(200)
        .json({ message: "No publishes found for this student and staff." });
    }

    RESPONSE.Success.Message = MESSAGE.SUCCESS;
    RESPONSE.Success.data = publishes;
    res.status(200).send(RESPONSE.Success);
  } catch (error) {
    console.error("Error in getStudentReportsForStaff:", error);
    res.status(500).json({ message: error.message });
  }
};
