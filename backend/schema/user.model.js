import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      select: false,
    },
    avatar: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    role: {
      type: String,
      default: "user",
    },
    provideAccountId: {
      type: String,
      unique: true
    },
    provider: {
      type: String
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { collection: "user", timestamps: true, versionKey: false }
);

export default mongoose.model("user", UserSchema);
