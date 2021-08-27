const express = require('express')
const handlebars = require('express-handlebars')
const db = require('./models')
const flash = require('connect-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const passport = require('./config/passport')

const app = express()
const port = process.env.PORT || 3000

// 設定 view engine 使用 handlebars
// express-handlebars 在 2019/5/15 v3.1.0 之後，{defaultLayout: 'main'}已經是預設值
app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
// setup bodyParser, session, passport, flash, method-override
app.use(express.urlencoded({ extended: true }))
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(methodOverride('_method'))
app.use('/upload', express.static(__dirname + '/upload'))

// 把 req.flash 放到 res.locals 裡面
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = req.user
  next()
})

// listen to port 3000
app.listen(port, () => {
  db.sequelize.sync()
  console.log(`Example app listening at http://localhost:${port}`)
})

// 引入 routes 並將 app 傳進去，讓 routes 可以用 app 這個物件來指定路由
// 把 passport 傳入 routes
require('./routes')(app, passport)

// 導入自動化測試以後，由於測試環境會用到app，所以需要在文件最下方輸出app
module.exports = app
