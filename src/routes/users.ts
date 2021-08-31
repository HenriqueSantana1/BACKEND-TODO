import { Router } from 'express'
import { createUser, loginUser } from '../controllers/userController'

const router = Router()

router.post('/create', createUser)

router.post('/login', loginUser)

module.exports = router