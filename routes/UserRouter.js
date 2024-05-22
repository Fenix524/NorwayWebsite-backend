import express from 'express'
import {
	createUser,
	deleteUser,
	getAllUsers,
	getMe,
	getOneUser,
	login,
	signup,
	updateUser,
} from '../controllers/UserController.js'

const userRouter = express.Router()

userRouter.get('/', getAllUsers)
userRouter.post('/', createUser)
userRouter.get('/:id', getOneUser)
userRouter.put('/:id', updateUser)
userRouter.delete('/:id', deleteUser)

export default userRouter
