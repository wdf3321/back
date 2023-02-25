import doctors from '../models/doctors.js'

export const createDoctors = async (req, res) => {
  try {
    const result = await doctors.create({
      time: req.body.time,
      mon: req.body.mon,
      tue: req.body.tue,
      wed: req.body.wed,
      thur: req.body.thur,
      fri: req.body.fri,
      sat: req.body.sat,
      sun: req.body.sun
    })
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}
export const getAllDoctors = async (req, res) => {
  try {
    const result = await doctors.find()
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}
export const editDoctors = async (req, res) => {
  try {
    const data = {
      time: req.body.time,
      mon: req.body.mon,
      tue: req.body.tue,
      wed: req.body.wed,
      thur: req.body.thur,
      fri: req.body.fri,
      sat: req.body.sat,
      sun: req.body.sun
    }
    console.log(req.body)
    const result = await doctors.findOneAndUpdate({ time: req.body.time }, data)
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
