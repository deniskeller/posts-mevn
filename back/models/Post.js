const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  name: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
}, {
  collection: 'posts'
})

module.exports = mongoose.model('Post', postSchema)
