const express = require("express");
const { authorization } = require("../middlewares/authorization.middlewares");
const { NoticeModel } = require("../models/notices.models");

const noticeRouter = express.Router();

noticeRouter.get("/", authorization, (req, res) => {
  const userID = req.userID;
  res.json({ message: "Hi inside from notice", userID });
});

noticeRouter.get("/user", authorization, async (req, res) => {
  const { category } = req.query;
  const userID = req.userID;
  if (category) {
    const data = await NoticeModel.find({ userID, category });
    return res.send(data);
  }
  const data = await NoticeModel.find({ userID });
  //   res.json({ category });
  res.send(data);
});

noticeRouter.post("/add", authorization, async (req, res) => {
  const { title, body, category, date } = req.body;
  const userID = req.userID;
  //   res.json({ title, body, category, date, userID });
  await NoticeModel.create({ title, body, category, date, userID });
  res.json({ message: "Notice has been created successfully" });
});

noticeRouter.patch("/update/:id", authorization, async (req, res) => {
  const { id } = req.params;
  const userID = req.userID;
  const noticeDetails = await NoticeModel.findOne({ _id: id });
  if (!noticeDetails) {
    return res.status(404).json({ message: "Notice does not exist" });
  }
  //   res.json({ noticeDetails });
  if (noticeDetails.userID != userID) {
    return res
      .status(400)
      .json({ message: "You are not authorized to update this notice" });
  }
  await NoticeModel.findOneAndUpdate({ _id: id }, req.body);
  res.json({ message: "The notice has been updated" });
});

noticeRouter.delete("/delete/:id", authorization, async (req, res) => {
  const { id } = req.params;
  const userID = req.userID;
  const noticeDetails = await NoticeModel.findOne({ _id: id });
  if (!noticeDetails) {
    return res.status(404).json({ message: "Notice does not exist" });
  }
  //   res.json({ noticeDetails });
  if (noticeDetails.userID != userID) {
    return res
      .status(400)
      .json({ message: "You are not authorized to delete this notice" });
  }
  await NoticeModel.findOneAndDelete({ _id: id });
  res.json({ message: "The notice has been deleted successfully" });
});

module.exports = { noticeRouter };
