import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100,
    },
    price: {
      type: Number,
      required: true,
      maxLength: 5,
      default: 0.0,
    },
    description: {
      type: String,
      required: true,
    },
    ratings: {
      type: Number,
      default: 0,
    },
    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    category: {
      type: String,
      required: true,
      enum: {
        values: ["Quần tây", "Đầm", "Áo vest"],
      },
    },
    seller: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      maxLength: 5,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
      },
    ],
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { collection: "product", timestamps: true, versionKey: false }
);

export default mongoose.model("product", ProductSchema);
