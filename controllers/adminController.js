// 後台入口
const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminService = require('../services/adminService.js')

const adminController = {
  // 瀏覽餐廳總表
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (data) => {
      return res.render('admin/restaurants', data)
    })
  },
  // 新增一筆:表單
  createRestaurant: (req, res) => {
    Category.findAll({ raw: true, nest: true }).then(categories => {
      return res.render('admin/create', { categories: categories })
    })

  },
  // 新增一筆:執行
  postRestaurant: (req, res) => {
    adminService.postRestaurant(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect('/admin/restaurants')
    })
  },
  // 瀏覽一筆
  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, (data) => res.render('admin/restaurant', data))
  },
  // 編輯一筆:表單
  editRestaurant: (req, res) => {
    return Category.findAll({ raw: true, nest: true }).then(categories => {
      Restaurant.findByPk(req.params.id).then(restaurant => {
        return res.render('admin/create', { categories: categories, restaurant: restaurant.toJSON() })
      })
    })
  },
  // 編輯一筆:執行
  putRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
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
                req.flash('success_messages', 'restaurant was successfully to update')
                res.redirect('/admin/restaurants')
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
              req.flash('success_messages', 'restaurant was successfully to update')
              res.redirect('/admin/restaurants')
            })
        })
    }
  },
  // 刪除一筆
  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, (data) => {
      if (data['status'] === 'success') {
        res.redirect('/admin/restaurants')
      }
    })
  },

  // 使用者清單
  getUsers: (req, res) => {
    User.findAll({ raw: true, nest: true })
      .then(users => res.render('admin/users', { users }))
      .catch(error => res.status(422).json(error))
  },

  toggleAdmin: (req, res) => {
    const id = Number(req.params.id)
    // 考量到切換 admin 本身需要 admin role，可以預設使用者不能切換自己的 admin，但會導致 A17-test 失敗，故先取消
    // if (id === req.user.id) {
    //   req.flash('error_messages', `not available to toggle user's own role`)
    //   return res.redirect('/admin/users')
    // }

    User.findByPk(id)
      .then(user => user.update({ isAdmin: !user.isAdmin }))
      .then(user => {
        req.flash('success_messages', 'user was successfully to update')
        res.redirect('/admin/users')
      })
      .catch(error => res.status(422).json(error))
  }
}

module.exports = adminController
