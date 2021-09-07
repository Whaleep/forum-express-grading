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
  },
  // 新增一筆分類
  postCategory: (req, res, callback) => {
    if (!req.body.name) {
      callback({ status: 'error', message: 'name didn\'t exist' })
    } else {
      return Category.create({ name: req.body.name })
        .then((category) =>
          callback({ status: 'success', message: '' })
        )
    }
  },

  putCategory: (req, res, callback) => {
    if (!req.body.name) {
      callback({ status: 'error', message: 'name didn\'t exist' })
    } else {
      Category.findByPk(req.params.id)
        .then((category) => {
          category.update(req.body)
            .then((category) => callback({ status: 'success', message: '' }))
        })
    }
  },

  deleteCategory: (req, res, callback) => {
    Category.findByPk(req.params.id)
      .then((category) => {
        category.destroy()
          .then((category) => { callback({ status: 'success', message: '' }) })
      })
  }
}

module.exports = categoryService
