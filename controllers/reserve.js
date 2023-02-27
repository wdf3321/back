import reserve from '../models/reserve.js'
import users from '../models/users.js'
import moment from 'moment'
import schedule from 'node-schedule'

export const createReserve = async (req, res) => {
  try {
    console.log(req.body)
    const result = await reserve.create({
      date: req.body.date,
      time: req.body.time,
      member: req.body.member
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

export const getReservelimit = async (req, res) => {
  try {
    console.log('getting...')
    const result = await reserve.find()
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const deleteReserve = async (req, res) => {
  try {
    console.log(req.params.id)
    const result = await reserve.findByIdAndDelete({ _id: req.params.id })
    res.status(200).json({ success: true, message: result })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
export const deleteAllReserveLimit = async (req, res) => {
  try {
    const result = await reserve.deleteMany()
    res.status(200).json({ success: true, message: result })
  } catch (error) {
    res.status(500).json({ success: false, message: error })
  }
}
export const makeReserve = async (req, res) => {
  try {
    const user = await users.findOne({ name: req.user.name })
    const reservefind = await reserve.findOne({ date: req.body.date, time: req.body.time })

    if (!user) {
      return res.status(404).json({ success: false, message: '找不到用戶' })
    }

    if (!reserve) {
      return res.status(404).json({ success: false, message: '找不到預約' })
    }

    if (reservefind.member < req.body.member) {
      return res.status(400).json({ success: false, message: '人數不足' })
    }

    reservefind.member -= req.body.member

    const result = await user.reserve.push({
      time: req.body.time,
      date: req.body.date,
      member: req.body.member,
      name: req.body.name
    })

    await Promise.all([reservefind.save(), user.save()])
    // deleteReserveWithZeroMembers()
    res.status(200).json({ success: true, message: result })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const findAllUsersReserves = async (req, res) => {
  try {
    const usersWithReservations = await users.find().populate('reserve')
    const reservations = usersWithReservations.flatMap(user => user.reserve)
    res.status(200).json({ success: true, message: reservations })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const deleteReservation = async (req, res) => {
  try {
    // console.log(req.body)
    const userfind = await users.find()
    const timefind = await reserve.find({ date: req.body.date, time: req.body.time })
    console.log(timefind)
    let result = '找不到'

    if (userfind.result !== [] && timefind.result !== []) {
      for (let i = 0; i < userfind.length; i++) {
        let update = false
        const user = userfind[i]

        let reserveMembers = 0

        for (let j = 0; j < user.reserve.length; j++) {
          if (user.reserve[j]._id.toString() === req.body.id) {
            reserveMembers = user.reserve[j].member
            user.reserve.splice(j, j + 1)
            update = true
          }
        }
        if (update) {
          console.log(timefind)
          const remain = timefind[0]?.member + reserveMembers
          if (isNaN(remain) === true) {
            result = await users.findOneAndUpdate({ _id: user._id }, { reserve: user.reserve })
          } else {
            await reserve.findOneAndUpdate({ _id: timefind[0]?._id }, { member: remain })
            result = await users.findOneAndUpdate({ _id: user._id }, { reserve: user.reserve })
          }
        }
      }

      res.status(200).json({ success: true, message: result })
      return
    } else if (userfind.result === []) {
      res.status(404).json({ success: false, message: '' })
    }
  } catch (error) {
    // console.log(error.message)
    res.status(500).json({ success: false, message: error.message })
  }
}
// ---------------------------------------------
export const createReservationsForWeek = async (req, res) => {
  try {
    const { startDate, endDate, time, member } = req.body

    // Convert start and end dates to moment objects and set start time to 9am
    const start = moment(startDate).startOf('day').add(9, 'hours')
    const end = moment(endDate).startOf('day').add(9, 'hours')

    // Create reservations for each day
    const reservations = []
    let current = start
    while (current.isSameOrBefore(end)) {
      // Only create reservations for days that the business is open
      if (current.isoWeekday() <= 7) {
        const newReservation = await reserve.create({
          date: current.format('YYYY/MM/DD'),
          time,
          member
        })
        reservations.push(newReservation)
      }
      current = current.add(1, 'day')
    }

    res.status(200).json({ success: true, message: '一周預約建立成功', reservations })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// eslint-disable-next-line
const deleteReserveWithZeroMembers = async () => {
  try {
    await reserve.deleteOne({ member: 0 })
    console.log('已刪除人數為0')
  } catch (error) {
    console.error(error)
  }
}

const createReservationsMonday = async (req, res) => {
  console.log('createing...')
  const startDate = moment().format('YYYY/MM/DD')
  const endDate = moment().add(7, 'days').calendar()
  const time = '10:00'
  const member = '10'
  if (moment().format('dddd') === 'Monday') {
    // Convert start and end dates to moment objects and set start time to 9am
    const start = moment(startDate).startOf('day').add(9, 'hours')
    const end = moment(endDate).startOf('day').add(9, 'hours')

    // Create reservations for each day
    const reservations = []
    let current = start
    while (current.isSameOrBefore(end)) {
      // Only create reservations for days that the business is open
      if (current.isoWeekday() <= 7) {
        const newReservation = await reserve.create({
          date: current.format('YYYY/MM/DD'),
          time,
          member
        })
        reservations.push(newReservation)
      }
      current = current.add(1, 'day')
    }
  }
}

export const deleteAllUserReservations = async (req, res) => {
  try {
    const deletedReservations = await users.updateMany({}, { $unset: { reserve: 1 } })
    res.status(200).json({ success: true, message: deletedReservations })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// eslint-disable-next-line
function job() { schedule.scheduleJob('* 0 * * 1', createReservationsMonday) }
job()
// eslint-disable-next-line
// function job2() { schedule.scheduleJob('*/5 * * * *', getReservelimitjob) }
// job2()
