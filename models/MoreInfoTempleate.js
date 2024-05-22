import mongoose from 'mongoose'

// Схема загальної сутності для міст та пам'яток
export const moreInfoTempleateSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Поле "name" є обов\'язковим'],
		},
		shortDesc: String,
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
)

