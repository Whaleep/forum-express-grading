const db = require('../../models')
const Category = db.Category

const categoryService = require('../../services/categoryService.js')

const categoryController = {
  // 瀏覽所有分類&編輯分類的表單
  getCategories: (req, res) => {
    categoryService.getCategories(req, res, (data) => res.json(data))
  },
  // 新增一筆分類
  postCategory: (req, res) => {
    categoryService.postCategory(req, res, (data) => res.json(data))
  },
  putCategory: (req, res) => {
    categoryService.putCategory(req, res, (data) => res.json(data))
  },
  deleteCategory: (req, res) => {
    categoryService.deleteCategory(req, res, (data) => res.json(data))
  }
}

module.exports = categoryController
