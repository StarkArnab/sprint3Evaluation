const jwt = require("jsonwebtoken");
require("dotenv").config();

const authorization = (req, res, next) => {
  if (req.headers.authorization) {
    // console.log("HI");
    // next();
    const token = req.headers.authorization?.split("Bearer ")[1];
    // console.log(token);
    // next();
    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
      if (err) {
        return res.status(500).json({ message: "Something went wrong" });
      }
      const { userID } = decoded;
      //   console.log(userID);
      req.userID = userID;
      next();
    });
  } else {
    return res.status(400).json({ message: "Please Login!!" });
  }
};

module.exports = { authorization };
