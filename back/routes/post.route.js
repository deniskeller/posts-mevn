const express = require('express')
const postRoute = express.Router()

const PostModel = require('../models/Post')

//вывод постов
postRoute.route('/').get((req, res) => {
  PostModel.find((error, data) => {
    if(error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// созданеи поста
postRoute.route('/create-post').post((req, res, next) => {
  // console.log('req.body: ', req.body);
  PostModel.create(req.body, (error, data) => {
    if(error) {
      return next(error)
    } else {
      res.json(data)
    }
  })  
})

//изменение поста
postRoute.route('/update-post/:id').post((req, res, next) => {
  PostModel.findByIdAndUpdate(req.params.id, {$set: req.body}, (error, data) => {
    if(error) {
      return next(error)
    } else {
      res.json(data)
      console.log('Пост изменен');
    }
  })  
})

//удаление поста
postRoute.route('/delete-post/:id').delete((req, res, next) => {
  PostModel.findByIdAndRemove(req.params.id, (error, data) => {
    if(error) {
      return next(error)
    } else {
      res.status(200).json({
        msg: data
      })
      console.log('Пост удален');
    }
  })  
})



module.exports = postRoute;