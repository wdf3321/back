import { Router } from 'express'
import { jwt } from '../middleware/auth.js'
import admin from '../middleware/admin.js'
import content from '../middleware/content.js'
import { createDoctors, getAllDoctors, editDoctors } from '../controllers/doctors.js'

const router = Router()

router.post('/create', content('application/json'), jwt, admin, createDoctors)
router.get('/', getAllDoctors)
router.patch('/edit', content('application/json'), jwt, admin, editDoctors)

export default router
