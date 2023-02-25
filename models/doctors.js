import { model, Schema } from 'mongoose'

const DoctorSchema = new Schema({
  time: {
    type: String,
    required: [true, '請填入時間']
  },
  mon: {
    type: String,
    required: [true, '請填入醫師代號1']
  },
  tue: {
    type: String,
    required: [true, '請填入醫師代號2']
  },
  wed: {
    type: String,
    required: [true, '請填入醫師代號3']
  },
  thur: {
    type: String,
    required: [true, '請填入醫師代號4']
  },
  fri: {
    type: String,
    required: [true, '請填入醫師代號5']
  },
  sat: {
    type: String,
    required: [true, '請填入醫師代號6']
  },
  sun: {
    type: String,
    required: [true, '請填入醫師代號7']
  }

}, { versionKey: false })

export default model('doctors', DoctorSchema)
