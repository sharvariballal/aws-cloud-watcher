const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    cognitoSub: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      default: "",
    },

    budget: {
      type: Number,
      default: 0,
    },

    awsRegion: {
      type: String,
      default: "us-east-1",
    },

    awsAccessKey: {
      type: String,
      default: "",
    },

    awsSecretKey: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);