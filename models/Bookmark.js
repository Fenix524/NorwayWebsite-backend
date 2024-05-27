import mongoose from "mongoose";

const favoritePageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const Bookmark = mongoose.model("Bookmark", favoritePageSchema);
