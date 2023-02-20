import { Router } from 'express'
import content from '../middleware/content.js'
import admin from '../middleware/admin.js'
// import upload from '../middleware/upload.js'
import * as auth from '../middleware/auth.js'
import {
  createReserve,
  getReservelimit,
  deleteReserve,
  makeReserve,
  findAllUsersReserves,
  deleteReservation,
  createReservationsForWeek,
  createReservationsMonday
} from '../controllers/reserve.js'

const router = Router()

router.post('/', content('application/json'), auth.jwt, admin, createReserve)
router.post('/week', content('application/json'), auth.jwt, admin, createReservationsForWeek)
router.get('/', getReservelimit)
router.delete('/:id', auth.jwt, deleteReserve)
router.post('/make', auth.jwt, makeReserve)
router.get('/all', auth.jwt, findAllUsersReserves)
router.post('/cancel', auth.jwt, deleteReservation)
router.post('/monday', auth.jwt, createReservationsMonday)

// router.get('/all', jwt, admin, getAllProducts)
// router.get('/:id', getProduct)
// router.patch('/:id', content('multipart/form-data'), jwt, admin, upload, editProduct)

export default router
