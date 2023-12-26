const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { UserModel } = require("../models/users.models");

const userRouter = express.Router();

userRouter.get("/", (req, res) => {
  res.json({ message: "Hi from inside the user" });
});

userRouter.post("/signup", async (req, res) => {
  const { name, email, password, phone_number, department } = req.body;
  //   res.json({ name, email, password, phone_number, department });
  if (name && email && password && phone_number && department) {
    const userDetail = await UserModel.findOne({ email });
    // res.json({ userDetail });
    if (userDetail) {
      return res
        .status(400)
        .json({ message: "User already exists please login first!!" });
    }
    bcrypt.hash(password, 5, async function (err, hash) {
      if (err) {
        return res.status(500).json({ message: "Something went wrong!" });
      }
      await UserModel.create({
        name,
        email,
        password: hash,
        phone_number,
        department,
      });
      return res.json({ message: "User signed in successfully" });
    });
  } else {
    return res.status(400).json({ message: "Please fill all the details" });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  //   res.json({ email, password });
  if (email && password) {
    const userDetail = await UserModel.findOne({ email });
    if (userDetail) {
      bcrypt.compare(password, userDetail.password, function (err, result) {
        if (err) {
          return res.status(500).json({ message: "Something went wrong" });
        }
        if (result) {
          const token = jwt.sign(
            { userID: userDetail._id },
            process.env.JWT_SECRET
          );
          return res.json({ message: "Login successfull", token });
        } else {
          return res.status(400).json({ message: "Wrong credentials" });
        }
      });
    } else {
      return res
        .status(400)
        .json({ message: "User does not exist please signin first!" });
    }
  } else {
    return res
      .status(400)
      .json({ message: "Please Enter your email or password" });
  }
});

module.exports = { userRouter };
