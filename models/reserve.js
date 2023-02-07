import { Schema, model } from 'mongoose'
// import validator from 'validator'
// import bcrypt from 'bcrypt'
// const d = new Date()
const ReserveSchema = new Schema({
  date: {
    type: String,
    // default: d.toLocaleDateString(),
    required: [true, '缺少日期']
  },
  time: {
    type: String,
    // default: d.toLocaleTimeString(),
    required: [true, '缺少時間']
  },
  member: {
    type: Number,
    default: '1',
    required: [true, '缺少人數']
  }
})
export default model('reserve', ReserveSchema)
