const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const database = require('./database')
const bodyParser = require('body-parser')


//подключение к бд
mongoose.Promise = global.Promise;
mongoose.connect(database.db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,  
}).then(() => {
  console.log('Подключение к бд успешно');
},
(error) => {
  console.log('Подключение не возможно из-за ошибки: ' + error);  
})

const postAPI = require('../back/routes/post.route')
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(cors())

// API
app.use('/api/', postAPI)

// создание поста
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log('подключение к порту: ' + port);
})

// обработка ошибок
app.use(function(error, req, res, next) {
  console.error(error.message);
  if(!error.statusCode) error.statusCode = 500;
  res.status(error.statusCode).send(error.message);
})