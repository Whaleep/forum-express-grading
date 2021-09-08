const restService = require('../services/restService.js')

const restController = {
  getRestaurants: (req, res) => {
    restService.getRestaurants(req, res, (data) => res.render('restaurants', data))
  },
  getRestaurant: (req, res) => {
    restService.getRestaurant(req, res, (data) => res.render('restaurant', data))
  },
  getDashboard: (req, res) => {
    restService.getRestaurant(req, res, (data) => res.render('dashboard', data))
  },
  getFeeds: (req, res) => {
    restService.getFeeds(req, res, (data) => res.render('feeds', data))
  },
  getTopRestaurants: (req, res) => {
    restService.getTopRestaurants(req, res, (data) => res.render('topRestaurants', data))
  }
}

module.exports = restController
