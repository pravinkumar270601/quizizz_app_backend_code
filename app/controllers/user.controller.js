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
