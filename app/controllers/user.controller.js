const db = require("../models");
const User = db.users;
const bcrypt = require("bcrypt");

// Create and save a new User
exports.create = async (req, res) => {
  try {
    // Validate request
    if (!req.body.username || !req.body.email || !req.body.password) {
      return res.status(400).send({
        message: "Content can not be empty!",
      });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create a User
    const user = {
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    };

    // Save User in the database
    const data = await User.create(user);
    res.status(201).send({
      user_id: data.user_id,
      username: data.username,
      email: data.email,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while creating the User.",
    });
  }
};


// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate request
    if (!email || !password) {
      return res.status(400).send({
        message: "Email and password are required!",
      });
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).send({
        message: "User not found!",
      });
    }

    // Compare password with stored hash
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).send({
        message: "Invalid password!",
      });
    }

    // Successful login
    res.status(200).send({
      message: "Login successful!",
      user_id: user.user_id,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while logging in.",
    });
  }
};