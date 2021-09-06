const db = require('../../models')
const Restaurant = db.Restaurant
const Category = db.Category

const adminService = require('../../services/adminService.js')

const adminController = {
  // 瀏覽餐廳總表
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (data) => {
      return res.json(data)
    })
  },
  // 瀏覽一筆
  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, (data) => res.json(data))
  },
  // 新增一筆:執行
  postRestaurant: (req, res) => {
    adminService.postRestaurant(req, res, (data) => res.json(data))
  },
  // 刪除一筆
  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, (data) => res.json(data))
  }
}

module.exports = adminController
