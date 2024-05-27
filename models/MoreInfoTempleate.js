import mongoose from "mongoose";

export const pageType = {
  CITY: "City",
  LANDMARK: "Landmark",
};

// Схема загальної сутності для міст та пам'яток
export const moreInfoTempleateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Поле "name" є обов\'язковим'],
    },
    shortDesc: String,
    pageType: {
      type: String,
      required: true,
      enum: [pageType.LANDMARK, pageType.CITY],
    },
    images: [
      {
        url: {
          type: String,
          required: [true, "URL зображення є обов'язковим"],
        },
        description: String,
      },
    ],
    sections: [
      {
        title: {
          type: String,
          required: [true, "Заголовок розділу є обов'язковим"],
        },
        content: {
          type: String,
          required: [true, "Вміст розділу є обов'язковим"],
        },
        images: [String],
      },
    ],
  },
  {
    versionKey: false,
  }
);
