const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    photoUrl: {
      type: String,
      default:
        "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-transparent-600nw-2463868847.jpg",
    },
    participants: [
      {
        type: String,
        ref: "User",
        required: true,
      },
    ],
    admins: [
      {
        type: String,
        ref: "User",
        required: true,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Group = mongoose.model("Group", GroupSchema);

module.exports = Group;
