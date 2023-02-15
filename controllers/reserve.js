import reserve from '../models/reserve.js'
import users from '../models/users.js'

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
    res.status(500).json({ success: false, message: '未知錯誤' })
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
    const usersWithReservations = await users.find().populate('reserve')
    const reservations = usersWithReservations.flatMap(user => user.reserve)
    const reservation = reservations.find(r => r._id.equals(req.params.id))
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' })
    }
    // Remove the reservation from the user's reserve array
    const user = await users.findOne({ reserve: reservation })
    // console.log(user)
    user.reserve.pull(reservation.id)
    await user.save()

    // Delete the reservation from the database
    await reservation.remove()

    res.status(200).json({ success: true, message: 'Reservation deleted' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// export const createOrder = async (req, res) => {
//   try {
//     // 檢查購物車是不是空的
//     if (req.user.cart.length === 0) {
//       res.status(400).json({ success: false, message: '購物車是空的' })
//       return
//     }
//     // 檢查是否有下架商品
//     let result = await users.findById(req.user._id, 'cart').populate('cart.p_id')
//     const canCheckout = result.cart.every(cart => {
//       return cart.p_id.sell
//     })
//     if (!canCheckout) {
//       res.status(400).json({ success: false, message: '包含下架商品' })
//       return
//     }
//     // 建立訂單
//     result = await orders.create({ u_id: req.user._id, products: req.user.cart })
//     // 清空購物車
//     req.user.cart = []
//     await req.user.save()
//     res.status(200).json({ success: true, message: '' })
//   } catch (error) {
//     if (error.name === 'ValidationError') {
//       res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
//     } else {
//       res.status(500).json({ success: false, message: '未知錯誤' })
//     }
//   }
// }

// export const getMyOrders = async (req, res) => {
//   try {
//     const result = await orders.find({ u_id: req.user._id }).populate('products.p_id')
//     res.status(200).json({ success: true, message: '', result })
//   } catch (error) {
//     res.status(500).json({ success: false, message: '未知錯誤' })
//   }
// }

// export const getAllOrders = async (req, res) => {
//   try {
//     // .populate(關聯資料路徑, 取的欄位)
//     const result = await orders.find().populate('products.p_id').populate('u_id', 'account')
//     res.status(200).json({ success: true, message: '', result })
//   } catch (error) {
//     res.status(500).json({ success: false, message: '未知錯誤' })
//   }
// }
