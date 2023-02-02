import users from '../models/users.js'
// import products from '../models/products.js'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
  try {
    await users.create({
      name: req.body.name,
      account: req.body.account,
      password: req.body.password,
      phone: req.body.phone
    })
    res.status(200).json({ success: true, message: '' })
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
      res.status(400).json({ success: false, message: '帳號重複' })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

export const login = async (req, res) => {
  try {
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1 day' })
    req.user.tokens.push(token)
    await req.user.save()
    res.status(200).json({
      success: true,
      message: '',
      result: {
        _id: req.user._id,
        token,
        account: req.user.account,
        name: req.user.name,
        phone: req.user.phone,
        // cart: req.user.cart.reduce((total, current) => total + current.quantity, 0),
        role: req.user.role,
        reserve: [req.user.reserve]
      }

    })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => token !== req.tokens)
    await req.user.save()
    res.status(200).json({ success: true, message: '' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const extend = async (req, res) => {
  try {
    const idx = req.user.tokens.findIndex(token => token === req.token)
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7 days' })
    req.user.tokens[idx] = token
    await req.user.save()
    res.status(200).json({ success: true, message: '', result: token })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const getUser = async (req, res) => {
  try {
    res.status(200).send({
      success: true,
      message: '',
      result: {
        _id: req.user._id,
        account: req.user.account,
        phone: req.user.phone,
        name: req.user.name,
        role: req.user.role
      }
    })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const editUser = async (req, res) => {
  try {
    const { data } = {
      _id: req.user._id,
      account: req.user.account,
      phone: req.user.phone,
      name: req.user.name
    }
    const result = await users.findByIdAndUpdate(req.user._id, data, { new: true })
    console.log(result)
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}
// export const editCart = async (req, res) => {
//   try {
//     // 找購物車有沒有此商品
//     const idx = req.user.cart.findIndex(cart => cart.p_id.toString() === req.body.p_id)
//     if (idx > -1) {
//       // 如果有，檢查新數量是多少
//       const quantity = req.user.cart[idx].quantity + parseInt(req.body.quantity)
//       console.log(req.body.quantity)
//       if (quantity <= 0) {
//         // 如果新數量小於 0，從購物車陣列移除
//         req.user.cart.splice(idx, 1)
//       } else {
//         // 如果新數量大於 0，修改購物車陣列數量
//         req.user.cart[idx].quantity = quantity
//       }
//     } else {
//       // 如果購物車內沒有此商品，檢查商品是否存在
//       const product = await products.findById(req.body.p_id)
//       // 如果不存在，回應 404
//       if (!product || !product.sell) {
//         res.status(404).send({ success: false, message: '找不到' })
//         return
//       }
//       // 如果存在，加入購物車陣列
//       req.user.cart.push({
//         p_id: req.body.p_id,
//         quantity: parseInt(req.body.quantity)
//       })
//     }
//     await req.user.save()
//     res.status(200).json({ success: true, message: '', result: req.user.cart.reduce((total, current) => total + current.quantity, 0) })
//   } catch (error) {
//     if (error.name === 'ValidationError') {
//       res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
//     } else {
//       res.status(500).json({ success: false, message: '未知錯誤' })
//     }
//   }
// }

// export const getCart = async (req, res) => {
//   try {
//     const result = await users.findById(req.user._id, 'cart').populate('cart.p_id')
//     res.status(200).json({ success: true, message: '', result: result.cart })
//   } catch (error) {
//     res.status(500).json({ success: false, message: '未知錯誤' })
//   }
// }
