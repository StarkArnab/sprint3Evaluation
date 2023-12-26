const express = require("express");
const cors = require("cors");
const { connection } = require("./config/db");
const { userRouter } = require("./routes/users.routes");
const { noticeRouter } = require("./routes/notices.routes");
require("dotenv").config();

const app = express();

app.use(express.json());

app.use(cors({ origin: "*" }));

app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

app.use("/user", userRouter);
app.use("/notice", noticeRouter);

const PORT = process.env.PORT || 8080;

app.listen(PORT, async () => {
  try {
    await connection;
    console.log("DB has been connected");
  } catch (error) {
    console.log(error);
  }
});
