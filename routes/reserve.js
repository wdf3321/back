import { Router } from 'express'
import content from '../middleware/content.js'
import admin from '../middleware/admin.js'
// import upload from '../middleware/upload.js'
import { jwt } from '../middleware/auth.js'
import { createReserve, getReservelimit } from '../controllers/reserve.js'

const router = Router()

router.post('/', content('application/json'), jwt, admin, createReserve)
router.get('/', getReservelimit)
// router.get('/all', jwt, admin, getAllProducts)
// router.get('/:id', getProduct)
// router.patch('/:id', content('multipart/form-data'), jwt, admin, upload, editProduct)

export default router
