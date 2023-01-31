import { Router } from 'express'
import content from '../middleware/content.js'
import * as auth from '../middleware/auth.js'
import { register, login, getUser } from '../controllers/users.js'
// , logout, extend, , editCart, getCart 
const router = Router()

router.post('/', content('application/json'), register)
router.post('/login', content('application/json'), auth.login, login)
// router.delete('/logout', auth.jwt, logout)
// router.patch('/extend', auth.jwt, extend)
router.get('/', getUser)
// router.post('/cart', content('application/json'), auth.jwt, editCart)
// router.get('/cart', auth.jwt, getCart)

export default router
