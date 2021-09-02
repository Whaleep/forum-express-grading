const helpers = require('../_helpers')
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

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
    return Promise.all([
      User.findByPk(req.params.id),
      Comment.findAndCountAll({
        where: { Userid: req.params.id }, attributes: ['RestaurantId'], group: ['RestaurantId'], include: Restaurant,
        raw: true, nest: true
      }),
    ])
      .then(values => {
        const [profile, comments] = values
        return res.render('user/profile', {
          profile: profile.toJSON(),
          commentedRestCount: comments.count.length, commentedRestaurants: comments.rows
        })
      })
      .catch(error => res.status(422).json(error))
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
    const getUser = helpers.getUser(req)
    const id = Number(req.params.id)
    const name = req.body.name

    if (getUser.id !== id) {
      return res.redirect(`/users/${getUser.id}/edit`)
    }
    if (!name) {
      req.flash('error_messages', 'name didn\'t exist')
      return res.redirect('back')
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return User.findByPk(id)
          .then(profile => profile.update({ name, image: file ? img.data.link : profile.image }))
          .then(profile => {
            req.flash('success_messages', 'profile was successfully to update')
            return res.redirect(`/users/${getUser.id}`)
          })
          .catch(error => res.status(422).json(error))
      })
    }
    else {
      return User.findByPk(id)
        .then(profile => profile.update({ name, image: profile.image }))
        .then(profile => {
          req.flash('success_messages', 'profile was successfully to update')
          return res.redirect(`/users/${helpers.getUser(req).id}`)
        })
        .catch(error => res.status(422).json(error))
    }
  }
}

module.exports = userController
