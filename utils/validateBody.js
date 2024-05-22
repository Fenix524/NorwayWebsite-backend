import HttpError from './HttpError.js'

const validateBody = schema => {
	const func = (req, res, next) => {
		const { error } = schema.validate(req.body)
		if (error) {
			console.log(error)
			next(HttpError(400, error))
		}
		next()
	}

	return func
}

export default validateBody
