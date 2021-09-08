// 後台入口
const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

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
    adminService.putRestaurant(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect('/admin/restaurants')
    })
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
    adminService.getUsers(req, res, (data) => res.render('admin/users', data))
  },

  toggleAdmin: (req, res) => {
    adminService.toggleAdmin(req, res, (data) => {
      if (data['status'] === 'success') {
        req.flash('success_messages', data['message'])
        res.redirect('/admin/users')
      }
    })
  }
}

module.exports = adminController
