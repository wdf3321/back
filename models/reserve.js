import { Schema, model } from 'mongoose'
// import validator from 'validator'
// import bcrypt from 'bcrypt'

const ReserveSchema = new Schema({
  date: {
    type: String,
    default: Date.now(),
    required: [true, '缺少日期']
  },
  time: {
    type: String,
    required: [true, '缺少時間']
  },
  member: {
    type: Number,
    required: [true, '缺少人數']
  }
})
export default model('reserve', ReserveSchema)
