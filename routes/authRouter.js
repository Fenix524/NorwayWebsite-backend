import express from 'express'
import { getMe, login, signup } from '../controllers/UserController.js'

const authRouter = express.Router()

authRouter.post('/login', login)
authRouter.post('/signup', signup)
authRouter.get('/me', getMe)

export default authRouter
