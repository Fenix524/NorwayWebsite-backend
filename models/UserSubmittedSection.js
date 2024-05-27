const UserSubmittedSectionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    page: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "pageType",
    },
    pageType: {
      type: String,
      required: true,
      enum: ["Landmark", "City"],
    },
    title: {
      type: String,
      required: [true, "Заголовок розділу є обов'язковим"],
    },
    content: {
      type: String,
      required: [true, "Вміст розділу є обов'язковим"],
    },
    images: [String],
    approved: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const UserSubmittedSection = mongoose.model(
  "UserSubmittedSection",
  UserSubmittedSectionSchema
);
