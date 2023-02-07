import { model, Schema } from 'mongoose'

const ArticleSchema = new Schema({
  date: {
    type: String,
    required: false
  },
  title: {
    type: String,
    required: [true, '請填入文章名稱'],
    minlength: [1, '請填入文章名稱']
  },
  inside: {
    type: String,
    required: [true, '請填入文章名稱'],
    minlength: [1, '請填入文章名稱']
  }

}, { versionKey: false })

export default model('articles', ArticleSchema)
