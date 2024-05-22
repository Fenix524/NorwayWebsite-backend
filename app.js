import createError from 'http-errors'
import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import dotenv from 'dotenv'

import indexRouter from './routes/index.js'
import citiesRouter from './routes/CityRouter.js'
import landmarksRouter from './routes/LandmarkRouter.js'
import userRouter from './routes/UserRouter.js'
import authRouter from './routes/authRouter.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config()
const app = express()

// view engine setup
app.set('views', join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/auth', authRouter)
app.use('/users', userRouter)
app.use('/cities', citiesRouter)
app.use('/landmarks', landmarksRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404))
})
app.use((err, req, res, next) => {
	const { status = 500, message = 'Server error' } = err
	res.status(status).json({ message })
})
// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message
	res.locals.error = req.app.get('env') === 'development' ? err : {}

	// render the error page
	res.status(err.status || 500)
	res.render('error')
})

export default app
