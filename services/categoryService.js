const db = require('../models')
const Category = db.Category

const categoryService = {
  // 瀏覽所有分類&編輯分類的表單
  getCategories: (req, res, callback) => {
    return Category.findAll({ raw: true, nest: true })
      .then(categories => {
        if (req.params.id) {
          Category.findByPk(req.params.id)
            .then((category) => callback({ categories: categories, category: category.toJSON() }))
        } else {
          callback({ categories: categories })
        }
      })
  }
}

module.exports = categoryService
