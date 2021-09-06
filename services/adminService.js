const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

const adminService = {
  // 瀏覽餐廳總表
  getRestaurants: (req, res, callback) => {
    return Restaurant.findAll({ raw: true, nest: true, include: [Category] })
      .then(restaurants => {
        callback({ restaurants: restaurants })
      })
  },
  // 瀏覽一筆
  getRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id, { include: [Category] })
      .then(restaurant => callback({ restaurant: restaurant.toJSON() }))
  }
}

module.exports = adminService
