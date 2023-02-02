import { Router } from 'express'
import { jwt } from '../middleware/auth.js'
import admin from '../middleware/admin.js'
import { createArticles, getAllArticles } from '../controllers/articles.js'
//, getMyOrders, getAllOrders

const router = Router()

router.post('/', jwt, admin, createArticles)
router.get('/', getAllArticles)
// router.get('/', jwt, getMyOrders)

export default router
