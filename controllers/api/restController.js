const restService = require('../../services/restService.js')

const restController = {
  getRestaurants: (req, res) => {
    restService.getRestaurants(req, res, (data) => res.json(data))
  },
  getRestaurant: (req, res) => {
    restService.getRestaurant(req, res, (data) => res.json(data))
  },
  getDashboard: (req, res) => {
    restService.getRestaurant(req, res, (data) => res.json(data))
  },
  getFeeds: (req, res) => {
    restService.getFeeds(req, res, (data) => res.json(data))
  },
  getTopRestaurants: (req, res) => {
    restService.getTopRestaurants(req, res, (data) => res.json(data))
  }
}

module.exports = restController
