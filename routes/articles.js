import { Router } from 'express'
import { jwt } from '../middleware/auth.js'
import admin from '../middleware/admin.js'
import { createArticles, getAllArticles, deleteArticles } from '../controllers/articles.js'
//, getMyOrders, getAllOrders,deleteArticles

const router = Router()

router.post('/create', jwt, admin, createArticles)
router.get('/', getAllArticles)
router.delete('/delete', jwt, admin, deleteArticles)

// router.get('/', jwt, getMyOrders)

export default router
