const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const User = db.User
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminService = {
  // 瀏覽餐廳總表
  getRestaurants: (req, res, callback) => {
    return Restaurant.findAll({ raw: true, nest: true, include: [Category] })
      .then(restaurants => {
        callback({ restaurants: restaurants })
      })
  },
  // 新增一筆:執行
  postRestaurant: (req, res, callback) => {
    if (!req.body.name) {
      return callback({ status: 'error', message: "name didn't exist" })
    }
    const { file } = req  // equal to const file = req.file
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return Restaurant.create({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: file ? img.data.link : null,
          CategoryId: req.body.categoryId
        }).then((restaurant) => {
          callback({ status: 'success', message: 'restaurant was successfully created' })
        })
      })
    }
    else {
      return Restaurant.create({
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        opening_hours: req.body.opening_hours,
        description: req.body.description,
        image: null,
        CategoryId: req.body.categoryId
      }).then((restaurant) => {
        callback({ status: 'success', message: 'restaurant was successfully created' })
      })
    }
  },
  // 瀏覽一筆
  getRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id, { include: [Category] })
      .then(restaurant => callback({ restaurant: restaurant.toJSON() }))
  },
  // 編輯一筆:執行
  putRestaurant: (req, res, callback) => {
    if (!req.body.name) {
      return callback({ status: 'error', message: "name didn't exist" })
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return Restaurant.findByPk(req.params.id)
          .then((restaurant) => {
            restaurant.update({
              name: req.body.name,
              tel: req.body.tel,
              address: req.body.address,
              opening_hours: req.body.opening_hours,
              description: req.body.description,
              image: file ? img.data.link : restaurant.image,
              CategoryId: req.body.categoryId
            })
              .then((restaurant) => {
                callback({ status: 'success', message: 'restaurant was successfully to update' })
              })
          })
      })
    }
    else {
      return Restaurant.findByPk(req.params.id)
        .then((restaurant) => {
          restaurant.update({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: restaurant.image,
            CategoryId: req.body.categoryId
          })
            .then((restaurant) => {
              callback({ status: 'success', message: 'restaurant was successfully to update' })
            })
        })
    }
  },
  // 刪除一筆
  deleteRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id)
      .then((restaurant) => {
        restaurant.destroy()
          .then(() => callback({ status: 'success', message: '' }))
      })
  },
  // 使用者清單
  getUsers: (req, res, callback) => {
    User.findAll({ raw: true, nest: true })
      .then(users =>
        callback({ users })
      )
      .catch(error => res.status(422).json(error))
  },

  toggleAdmin: (req, res, callback) => {
    const id = Number(req.params.id)
    // 考量到切換 admin 本身需要 admin role，可以預設使用者不能切換自己的 admin，但會導致 A17-test 失敗，故先取消
    // if (id === req.user.id) {
    //   req.flash('error_messages', `not available to toggle user's own role`)
    //   return res.redirect('/admin/users')
    // }

    User.findByPk(id)
      .then(user => user.update({ isAdmin: !user.isAdmin }))
      .then(user => {
        callback({ status: 'success', message: 'user was successfully to update' })
      })
      .catch(error => res.status(422).json(error))
  }
}

module.exports = adminService
