import { Schema, model } from "mongoose";

const questionAnswerSchema = new Schema(
  {
    question: {
      type: String,
      required: [true, "Питання є обов'язковим"],
    },
    askedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    questionDate: { type: Date, default: Date.now() },
    answers: [
      {
        answer: { type: String, required: [true, "Відповідь є обов'язковою"] },
        answeredBy: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        answerDate: { type: Date, default: Date.now() },
        likes: [
          {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
        ],
        likesTotalCount: { type: Number, default: 0 },
      },
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    likesTotalCount: { type: Number, default: 0 },
    isBlocked: { type: Boolean, default: false },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

// Хук для оновлення likesTotalCount при зміні likes
questionAnswerSchema.pre("save", async function () {
  this.likesTotalCount = this.likes.length;

  // Оновлення likesTotalCount для кожної відповіді
  for (const answer of this.answers) {
    answer.likesTotalCount = answer.likes.length;
  }

  this.answers.sort((a, b) => {
    if (a.likesTotalCount === b.likesTotalCount) {
      return a.answerDate - b.answerDate;
    }
    return b.likesTotalCount - a.likesTotalCount;
  });
});

export const QuestionAnswer = model("QuestionAnswer", questionAnswerSchema);
