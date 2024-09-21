const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../models");
const Student = db.students;
const Sequelize = require("sequelize");

const RESPONSE = require("../constants/response");
const { MESSAGE } = require("../constants/message");
const { StatusCode } = require("../constants/HttpStatusCode");

exports.studentSignup = async (req, res) => {
  try {
    const { student_name, email, password, phone_number } = req.body;

    // Check if email or phone number already exists
    const existingStudent = await Student.findOne({
      where: { [Sequelize.Op.or]: [{ email }, { phone_number }] },
    });

    if (existingStudent) {
      return res
        .status(400)
        .send({ message: "Email and phone number already in use" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create student
    const student = await Student.create({
      student_name,
      email,
      phone_number,
      password: hashedPassword,
    });

    RESPONSE.Success.Message = "Student registered successfully";
    RESPONSE.Success.data = student ;

    res.status(201).send(RESPONSE.Success);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.studentLogin = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    // Find student by email or phone number
    const student = await Student.findOne({
      where: {
        [Sequelize.Op.or]: [
          { email: emailOrPhone },
          { phone_number: emailOrPhone },
        ],
      },
    });

    if (!student) {
      return res
        .status(400)
        .send({ message: "Invalid email/phone or password" });
    }

    // Compare passwords
    const validPassword = await bcrypt.compare(password, student.password);
    if (!validPassword) {
      return res
        .status(400)
        .send({ message: "Invalid email/phone or password" });
    }

    // Generate JWT
    const token = jwt.sign({ student_id: student.student_id }, "secretKey", {
      expiresIn: "1h",
    });

    res.status(200).send({
      message: "Login successful",
      token,
      student: {
        id: student.student_id,
        student_name: student.student_name,
        email: student.email,
        phone_number: student.phone_number,
      },
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getAllStudents = async (req, res) => {
    try {
      // Fetch students with only specific fields
      const students = await Student.findAll({
        attributes: ['student_id', 'student_name', 'email'],
      });
  
      if (students.length === 0) {
        return res.status(404).json({ message: 'No students found' });
      }
  
      res.status(200).json({ data: students });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
