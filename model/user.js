const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const { Schema } = mongoose;

const userSchema = Schema(
  {
    email: {
      type: String,
      required: [true, "please enter an email"],
      unique: true,
      lowercase: true,
      validate: [isEmail, "please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "please enter password"],
      minlength: [6, "minimum password length is 6 characters"],
    },
  },
  { collection: "node-auth" }
);

// after post
userSchema.post("save", (doc, next) => {
  // console.log("new user was created", doc);
  next();
});

// before post
userSchema.pre("save", async function (next) {
  // console.log('user about to be created',this);
  const salt = await bcrypt.genSalt();
  //   console.log(this.password);
  this.password = await bcrypt.hash(this.password, salt);
  //   console.log(this.password);
  next();
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if(auth){
      return user
    }
    throw new Error('incorrect password')
  }

  throw new Error('incorrect user')
};

exports.User = mongoose.model("User", userSchema);
