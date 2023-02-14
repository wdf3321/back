import express from 'express'
import content from '../middleware/content.js'
import * as auth from '../middleware/auth.js'
import admin from '../middleware/admin.js'
import upload from '../middleware/upload.js'
import {
  createBanner,
  getBanners,
  getAllBanners,
  getBanner,
  editBanner,
  deleteBanner
} from '../controllers/banner.js'

const router = express.Router()

router.post('/', content('multipart/form-data'), auth.jwt, admin, upload, createBanner)
router.get('/', getBanners)
router.get('/all', auth.jwt, admin, getAllBanners)

router.get('/:id', getBanner)
router.patch('/:id', content('multipart/form-data'), auth.jwt, admin, upload, editBanner)
router.delete('/:id', auth.jwt, admin, deleteBanner)

export default router
