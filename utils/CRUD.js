import HttpError from './HttpError.js'

export const CRUDOpertion = {
	CREATE: 'create',
	GET_ALL: 'getAll',
	GET_BY_ID: 'getById',
	UPDATE: 'update',
	DELETE: 'delete',
}

/**
 * Створює обробник CRUD для моделі Mongoose.
 *
 * @param {Model} Model - Модель Mongoose, яка представляє документи в базі даних.
 * @param {string} operation - Операція CRUD, яку потрібно виконати (CREATE, GET_ALL, GET_BY_ID, UPDATE, DELETE).
 * @param {string} [findField='_id'] - Поле для пошуку документа при оновленні та видаленні.
 * @param {string[]} [fieldsForSearching=[]] - Поля для текстового пошуку при отриманні всіх документів.
 * @param {string[]} [replacementFields=[]] - Поля для підтягнення замість посилань у вихідних документах при отриманні всіх документів.
 *
 * @returns {Function} - Обробник запиту Express.
 */
export const createCRUDHandler = (
	Model,
	operation,
	findField = '_id',
	fieldsForSearching = [],
	replacementFields = []
) => {
	switch (operation) {
		case CRUDOpertion.CREATE:
			return async (req, res) => {
				try {
					const newDoc = await Model.create(req.body)
					res.status(201).json(newDoc)
				} catch (error) {
					res.status(500).json({ error: error.message })
				}
			}
		/**
		 * Метод для отримання всіх документів з бази даних з можливістю фільтрації, пошуку, сортування та пагінації.
		 *
		 * @param {string} req.query.filter - JSON-рядок для фільтрації документів. Наприклад, '{"field": "value"}'.
		 * @param {string} req.query.search - Рядок для пошуку в полях, вказаних у `fieldsForSearching`.
		 * @param {string} req.query.sort - Ім'я поля для сортування результатів.
		 * @param {string} req.query.order - Режим сортування: 'a-z' для сортування за зростанням, 'z-a' для сортування за спаданням.
		 * @param {number} req.query.page - Номер сторінки для пагінації.
		 * @param {number} req.query.limit - Кількість документів на сторінку для пагінації.
		 */
		case CRUDOpertion.GET_ALL:
			return async (req, res) => {
				try {
					let {
						filter,
						search,
						sort,
						order = 'a-z',
						page = 1,
						limit = 100,
					} = req.query
					let query = {}

					// Пошук за словом
					if (search && fieldsForSearching.length > 0) {
						query.$or = fieldsForSearching.map(field => ({
							[field]: { $regex: search, $options: 'i' },
						}))
					}

					// Фільтрація
					if (filter) {
						query = { ...query, ...JSON.parse(filter) }
					}

					// Сортування за зростанням або спаданням
					let sortOption = {}
					if (sort) {
						sortOption[sort] = order === 'a-z' ? 1 : -1
					}

					// Пагінація
					let skip = (page - 1) * limit

					const docs = await Model.find(query)
						.sort(sortOption)
						.skip(skip)
						.limit(parseInt(limit))
						.populate(replacementFields)
						.exec()
					res.status(200).json(docs)
				} catch (error) {
					res.status(500).json({ error: error.message })
				}
			}

		case CRUDOpertion.GET_BY_ID:
			return async (req, res, next) => {
				try {
					const doc = await Model.findById(req.params.id)
					console.log(doc)
					if (!doc) {
						return next(HttpError(404))
					}
					res.status(200).json(doc)
				} catch (error) {
					res.status(500).json({ error: error.message })
				}
			}

		case CRUDOpertion.UPDATE:
			return async (req, res, next) => {
				console.log(req)
				try {
					const doc = await Model.findOneAndUpdate(
						{ [findField]: req.params.id },
						req.body,
						{
							new: true,
						}
					)
					if (!doc) {
						return next(HttpError(404))
					}
					res.status(200).json(doc)
				} catch (error) {
					res.status(500).json({ error: error.message })
				}
			}

		case CRUDOpertion.DELETE:
			return async (req, res) => {
				try {
					await Model.findOneAndDelete({ [findField || _id]: req.params.id })
					res.status(200).json({ message: 'Документ видалено' })
				} catch (error) {
					res.status(500).json({ error: error.message })
				}
			}

		default:
			return res.status(400).json({ error: 'Невідома операція' })
	}
}
