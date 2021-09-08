const helpers = require('../_helpers')
const db = require('../models')
const User = db.User
const Comment = db.Comment
const Favorite = db.Favorite
const Restaurant = db.Restaurant
const Like = db.Like
const Followship = db.Followship
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userService = {
  // 瀏覽 Profile
  getUser: (req, res, callback) => {
    const UserId = Number(req.params.id)
    return Promise.all([
      User.findByPk(UserId, {
        include: [
          { model: User, as: 'Followings' },
          { model: User, as: 'Followers' },
          { model: Restaurant, as: 'FavoritedRestaurants' }
        ]
      }),
      Comment.findAndCountAll({
        where: { UserId }, attributes: ['RestaurantId'], group: ['RestaurantId'], include: Restaurant,
        raw: true, nest: true
      }),
    ])
      .then(([profile, comments]) => {
        const isFollowed = helpers.getUser(req).Followings.map(d => d.id).includes(UserId)
        callback({ profile: profile.toJSON(), commentedRestaurants: comments.rows, isFollowed })
      })
      .catch(error => res.status(422).json(error))
  },
  // 編輯 Profile
  putUser: (req, res, callback) => {
    const getUser = helpers.getUser(req)
    const id = Number(req.params.id)
    const name = req.body.name

    if (getUser.id !== id) {
      callback({ status: 'error', message: '' })
    }
    if (!name) {
      callback({ status: 'error', message: 'name didn\'t exist' })
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return User.findByPk(id)
          .then(profile => profile.update({ name, image: file ? img.data.link : profile.image }))
          .then(profile => {
            callback({ status: 'success', message: 'profile was successfully to update' })
          })
          .catch(error => res.status(422).json(error))
      })
    }
    else {
      return User.findByPk(id)
        .then(profile => profile.update({ name, image: profile.image }))
        .then(profile => {
          callback({ status: 'success', message: 'profile was successfully to update' })
        })
        .catch(error => res.status(422).json(error))
    }
  },

  addFavorite: (req, res, callback) => {
    return Favorite.create({ UserId: helpers.getUser(req).id, RestaurantId: req.params.restaurantId })
      .then(() => callback({ status: 'success', message: '' }))
  },

  removeFavorite: (req, res, callback) => {
    return Favorite.findOne({ where: { UserId: helpers.getUser(req).id, RestaurantId: req.params.restaurantId } })
      .then((favorite) => {
        favorite.destroy()
          .then(() => { callback({ status: 'success', message: '' }) })
      })
  },

  addLike: (req, res, callback) => {
    return Like.create({ UserId: helpers.getUser(req).id, RestaurantId: req.params.restaurantId })
      .then(() => callback({ status: 'success', message: '' }))
  },

  removeLike: (req, res, callback) => {
    return Like.findOne({ where: { UserId: helpers.getUser(req).id, RestaurantId: req.params.restaurantId } })
      .then(like => like.destroy())
      .then(() => callback({ status: 'success', message: '' }))
  },

  getTopUser: (req, res, callback) => {
    return User.findAll({ include: [{ model: User, as: 'Followers' }] })
      .then(users => {
        users = users.map(user => ({
          ...user.dataValues,
          FollowerCount: user.Followers.length,
          isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
        }))
        users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
        return callback({ users: users })
      })
  },

  addFollowing: (req, res, callback) => {
    if (req.user.id === Number(req.params.userId)) { return res.redirect('back') }
    return Followship.create({ followerId: req.user.id, followingId: req.params.userId })
      .then(() => callback({ status: 'success', message: '' }))
  },

  removeFollowing: (req, res, callback) => {
    return Followship.findOne({ where: { followerId: req.user.id, followingId: req.params.userId } })
      .then((followship) => {
        followship.destroy()
          .then(() => callback({ status: 'success', message: '' }))
      })
  }
}

module.exports = userService
