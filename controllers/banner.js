import banner from '../models/banner.js'

export const createBanner = async (req, res) => {
  try {
    // console.log(req.file.path)
    const result = await banner.create({
      id: req.body.id,
      image: req.file?.path || ''
    })
    res.status(200).send({ success: true, message: result })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: error.message })
    }
  }
}

export const getBanners = async (req, res) => {
  try {
    const result = await banner.find()
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getAllBanners = async (req, res) => {
  try {
    const result = await banner.find()
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getBanner = async (req, res) => {
  try {
    const result = await banner.findById(req.params.id)
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const deleteBanner = async (req, res) => {
  try {
    const result = await banner.findByIdAndDelete(req.params.id)
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const editBanner = async (req, res) => {
  try {
    const data = {
      id: req.body.id
    }
    if (req.file) data.image = req.file.path
    const result = await banner.findByIdAndUpdate(req.params.id, data, { new: true })

    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}
