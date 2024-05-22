import express from 'express'

const router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', { title: 'Express' })
})
router.get('/ping', function (req, res, next) {
	res.status(200).json({ message: 'Server is raning' })
})
export default router
