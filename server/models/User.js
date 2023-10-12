const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

// import schema from horse.js
const horseSchema = require("./Horse");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, "Must use a valid email address"],
    },
    password: {
      type: String,
      required: true,
    },
    // Set savedHorses to be an array of data that adheres to the horseSchema
    savedHorses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Horse", // This should match the name of the Horse model
      },
    ],
  },
  // Set this to use virtual below
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// Hash user password
userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

// Custom method to compare and validate the password for logging in
userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// When we query a user, we'll also get another field called `horseCount` with the number of saved horses we have
userSchema.virtual("horseCount").get(function () {
  return this.savedHorses.length;
});

const User = model("User", userSchema);

module.exports = User;
