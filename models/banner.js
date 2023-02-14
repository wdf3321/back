import { model, Schema } from 'mongoose'

const bannerSchema = new Schema({
  id: {
    type: String,
    required: [true, '缺少id']
  },
  image: {
    type: String,
    required: [true, '缺少圖片']
  }
}, { versionKey: false })

export default model('banner', bannerSchema)
