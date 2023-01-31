import { Schema } from 'mongoose'

const ArticleSchema = new Schema({
  date: {
    type: date,
    default: Date.now()
  },
  title: {
    type: String,
    required: [true, '請填入文章名稱'],
    minlength: [1, '請填入文章名稱']
  },
  content: {
    type: String,
    required: [true, '請填入文章敘述'],
    minlength: [1, '請填入文章敘述']
  },
  image: {
    type: String
  },
  tag: {
    type: String,
    required: [true, '缺少分類'],
    enum: {
      values: ['最新消息', '醫學新知', '好康報報'],
      messages: '分類錯誤'
    }

  }
}, { versionKey: false })

export default model('articles', ArticleSchema)