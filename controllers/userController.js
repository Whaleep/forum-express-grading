const helpers = require('../_helpers')
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

const userService = require('../services/userService')

const userController = {
  // 註冊頁面
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  // 註冊操作
  signUp: (req, res) => {
    // confirm password 兩次輸入的密碼要相同
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
      // confirm unique user 信箱不能重複
      User.findOne({ where: { email: req.body.email } })
        .then(user => {
          if (user) {
            req.flash('error_messages', '信箱重複！')
            return res.redirect('/signup')
          } else {
            User.create({
              name: req.body.name,
              email: req.body.email,
              password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
            }).then(user => {
              req.flash('success_messages', '成功註冊帳號！')
              return res.redirect('/signin')
            })
          }
        })
    }
  },
  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  // 瀏覽 Profile
  getUser: (req, res) => {
    userService.getUser(req, res, (data) => res.render('user/profile', data))
  },
  // 瀏覽編輯 Profile 頁面
  editUser: (req, res) => {
    const getUser = helpers.getUser(req)
    // 依規格只能改自己的資料。理論上這樣可以不用在路由帶入:id ?
    if (getUser.id !== Number(req.params.id)) {
      return res.redirect(`/users/${getUser.id}/edit`)
    }
    // 如果需要帶入自己以外的使用者，再使用 User.findByPk(req.params.id) 帶入
    res.render('user/edit')
  },
  // 編輯 Profile
  putUser: (req, res) => {
    userService.putUser(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect(`/users/${helpers.getUser(req).id}`)
    })
  },

  addFavorite: (req, res) => {
    userService.addFavorite(req, res, (data) => {
      if (data['status'] === 'success') {
        res.redirect('back')
      }
    })
  },

  removeFavorite: (req, res) => {
    userService.removeFavorite(req, res, (data) => {
      if (data['status'] === 'success') {
        res.redirect('back')
      }
    })
  },

  addLike: (req, res) => {
    userService.addLike(req, res, (data) => {
      if (data['status'] === 'success') {
        res.redirect('back')
      }
    })
  },

  removeLike: (req, res) => {
    userService.removeLike(req, res, (data) => {
      if (data['status'] === 'success') {
        res.redirect('back')
      }
    })
  },

  getTopUser: (req, res) => {
    userService.getTopUser(req, res, (data) => res.render('topUser', data))
  },

  addFollowing: (req, res) => {
    userService.addFollowing(req, res, (data) => {
      if (data['status'] === 'success') {
        res.redirect('back')
      }
    })
  },

  removeFollowing: (req, res) => {
    userService.removeFollowing(req, res, (data) => {
      if (data['status'] === 'success') {
        res.redirect('back')
      }
    })
  }
}

module.exports = userController
