import articles from '../models/articles.js'

export const createArticles = async (req, res) => {
  try {
    const result = await articles.create({
      date: req.body.date,
      title: req.body.title,
      inside: req.body.inside
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
export const getAllArticles = async (req, res) => {
  try {
    const result = await articles.find()
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}
export const getOneArticle = async (req, res) => {
  try {
    const result = await articles.findById(req.params.id)
    if (!result) {
      res.status(404).json({ success: false, message: '找不到' })
    } else {
      res.status(200).json({ success: true, message: '', result })
    }
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404).json({ success: false, message: '找不到' })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

export const deleteArticles = async (req, res) => {
  try {
    console.log(req)
    const result = await articles.deleteOne(req.title)
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}
export const deleteSelectArticles = async (req, res) => {
  try {
    console.log(req)
    const result = await articles.findByIdAndDelete({ _id: req.params.id })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}
