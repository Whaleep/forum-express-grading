// 前台入口
const restController = {
  getRestaurants: (req, res) => {
    return res.render('restaurants')
  }
}
module.exports = restController
