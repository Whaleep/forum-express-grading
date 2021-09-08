const helpers = require('../_helpers')
const sequelize = require('sequelize')
const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const Favorite = db.Favorite
const User = db.User

const pageLimit = 10

const restService = {
  // 瀏覽所有餐廳
  getRestaurants: (req, res, callback) => {
    const whereQuery = {}
    let categoryId = ''
    let offset = 0
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery['categoryId'] = categoryId
    }
    Restaurant.findAndCountAll({ include: [Category], where: whereQuery, offset: offset, limit: pageLimit })
      .then(result => {
        // data for pagination
        const page = Number(req.query.page) || 1
        const pages = Math.ceil(result.count / pageLimit)
        const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
        const prev = page - 1 < 1 ? 1 : page - 1
        const next = page + 1 > pages ? pages : page + 1

        // clean up restaurant data
        const data = result.rows.map(r => ({
          ...r.dataValues,
          description: r.dataValues.description.substring(0, 50),
          categoryName: r.Category.name,
          isFavorited: req.user.FavoritedRestaurants.map(d => d.id).includes(r.id),
          isLiked: req.user.LikedRestaurants.map(d => d.id).includes(r.id)
        }))
        Category.findAll({ raw: true, nest: true }).then(categories =>
          callback({
            restaurants: data, categories: categories, categoryId: categoryId,
            page: page, totalPage: totalPage, prev: prev, next: next
          })
        )
      })
  },
  // 瀏覽個別餐廳
  getRestaurant: (req, res, callback) => {
    const getUser = helpers.getUser(req)
    return Restaurant.findByPk(req.params.id,
      { include: [Category, { model: User, as: 'FavoritedUsers' }, { model: User, as: 'LikedUsers' }, { model: Comment, include: [User] }] }
    )
      .then(restaurant => restaurant.increment('viewCounts'))
      .then(restaurant => {
        const isFavorited = restaurant.FavoritedUsers.map(d => d.id).includes(getUser.id)
        const isLiked = restaurant.LikedUsers.map(d => d.id).includes(getUser.id)
        return callback({ restaurant: restaurant.toJSON(), isFavorited: isFavorited, isLiked: isLiked })
      })
  },

  getDashboard: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id, { include: [Category, Comment, { model: User, as: 'FavoritedUsers' }] })
      .then(restaurant => callback({ restaurant: restaurant.toJSON() }))
  },

  getFeeds: (req, res, callback) => {
    return Promise.all([
      Restaurant.findAll({ limit: 10, raw: true, nest: true, order: [['createdAt', 'DESC']], include: [Category] }),
      Comment.findAll({ limit: 10, raw: true, nest: true, order: [['createdAt', 'DESC']], include: [User, Restaurant] })
    ])
      .then(([restaurants, comments]) => callback({ restaurants: restaurants, comments: comments }))
  },

  getTopRestaurants: (req, res, callback) => {
    Favorite.findAll({
      attributes: ['RestaurantId', [sequelize.fn('COUNT', sequelize.col('RestaurantId')), 'count']],
      include: Restaurant,
      group: ['RestaurantId'],
      order: [[sequelize.col('count'), 'DESC']],
      limit: 10, raw: true, nest: true
    })
      .then(restaurants => {
        const data = restaurants.map(r => ({
          count: r.count,
          ...r.Restaurant,
          description: r.Restaurant.description.substring(0, 100),
          isFavorited: helpers.getUser(req).FavoritedRestaurants.map(d => d.id).includes(r.Restaurant.id)
        }))
        return callback({ restaurants: data })
      })
      .catch(error => res.status(422).json(error))
  }
}
module.exports = restService
