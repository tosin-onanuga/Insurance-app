// const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utilis/jwtGenerator");
const models = require("../models/index");

const register = async (req, res) => {
  try {
    // 1. descructure the req.body(name etc)
    const { firstName, lastName, email, password } = req.body;

    const user = await models.User.findAll({
      where: {
        email: email,
      },
    });
    if (user.length > 0) {
      return res.status(400).json({
        success: false,
        error: "User with email already exist",
      });
    }
    //3. Bcrypt the user password
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptPassword = await bcrypt.hash(password, salt);

    //4. enter the new user inside our database
    const newUser = await models.User.create({
      firstName,
      lastName,
      email,
      password: bcryptPassword,
    });

    if (newUser) {
      //5. generating our jwt token
      const token = jwtGenerator(newUser.id);
      // return a success message on completion
      return res.status(200).json({
        success: true,
        message: "Account created successfully",
        token: token,
      });
    }
    // return a failure message on failure
    return res.status(500).json({
      success: false,
      error: "Unable to create account at the  moment",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      err,
    });
  }
};

const login = async (req, res) => {
  try {
    //1. destructure the req.body
    const { email, password } = req.body;
    //2. check if user doesnt exist (if not then throw error)
    const user = await models.User.findOne({
      where: {
        email: email
      }
    });
    if (!user) {
      return res.status(404).json("Password or Email is incorrect");
    }
    //3. check if incoming password is the same as database
    const validPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!validPassword) {
      return res.status(400).json("Password or Email incorrect");
    }

    //4. give them jwt token
    const token = jwtGenerator(user.id);
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
};

const is_verify = async (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
};

const adminLogin = async (req, res) => {
  try {
    //1. destructure the req.body
    const { email, password } = req.body;
    //2. check if user doesnt exist (if not then throw error)
    const admin = await models.Admin.findAll({
      where: {
        email: email
      }
    });
    if (admin.length < 1) {
      return res.status(401).json("Admin Password or Email is incorrect");
    }
    //3. check if incoming password is the same as database
    if (password !== admin[0].password) {
      return res.status(401).json("Password or Email incorrect");
    }

    //4. give them jwt token
    const token = jwtGenerator(admin[0].id);
    res.status(200).json({
      success: true,
      message: "Admin login successful",
      token: token
    })
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
};

module.exports = { register, login, adminLogin, is_verify };
