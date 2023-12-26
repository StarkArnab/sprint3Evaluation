const mongoose = require("mongoose");

const noticeSchema = mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  category: {
    type: String,
    enum: ["parking", "covid", "maintenance"],
    required: true,
  },
  date: { type: String, required: true },
  userID: { type: String, required: true },
});

const NoticeModel = mongoose.model("notice", noticeSchema);

module.exports = { NoticeModel };
