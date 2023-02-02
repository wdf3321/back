import { Schema, model, Error } from 'mongoose'
// import validator from 'validator'
import bcrypt from 'bcrypt'

const schema = new Schema({
  name: {
    type: String,
    required: true
  },
  account: {
    type: String,
    required: [true, '缺少帳號'],
    minlength: [4, '帳號太短'],
    maxlength: [20, '帳號太長'],
    unique: true,
    match: [/^[A-Za-z0-9]+$/, '帳號格式錯誤']
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true
  },
  tokens: {
    type: [String],
    default: []
  },
  role: {
    type: Number,
    // 0 = 使用者
    // 1 = 管理員
    default: 0
  },
  reserve: {
    type: [
      {
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
      }
    ],
    default: []
  }

}, { versionKey: false })

schema.pre('save', function (next) {
  const user = this
  if (user.isModified('password')) {
    if (user.password.length >= 4 && user.password.length <= 20) {
      user.password = bcrypt.hashSync(user.password, 10)
    } else {
      const error = new Error.ValidationError(null)
      error.addError('password', new Error.ValidatorError({ message: '密碼長度錯誤' }))
      next(error)
      return
    }
  }
  next()
})

schema.pre('findOneAndUpdate', function (next) {
  const user = this._update
  if (user.password) {
    if (user.password.length >= 4 && user.password.length <= 20) {
      user.password = bcrypt.hashSync(user.password, 10)
    } else {
      const error = new Error.ValidationError(null)
      error.addError('password', new Error.ValidatorError({ message: '密碼長度錯誤' }))
      next(error)
      return
    }
  }
  next()
})

export default model('users', schema)

// const ReserveSchema = new Schema({
//   date: {
//     type: String,
//     default: Date.now(),
//     required: [true, '缺少日期']
//   },
//   time: {
//     type: String,
//     required: [true, '缺少時間']
//   },
//   member: {
//     type: Number,
//     required: [true, '缺少人數']
//   }
// })
