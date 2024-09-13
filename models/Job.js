const mongoose = require("mongoose");

const JobSchema = mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Please provide the company"],
      maxLength: 50,
    },

    position: {
      type: String,
      required: [true, "Please provide the position"],
      maxLength: 100,
    },

    status: {
      type: String,
      enum: ["pending", "interview", "declined"],
      default: "pending",
    },

    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide the user"],
    },

    person: {
      type: String,
      required: [true, "Please provide the person"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", JobSchema);
