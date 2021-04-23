const mongoose = require('mongoose');
const { Schema, model } = mongoose;


const topicsSchema = new Schema({
    name: { type: String },
})


module.exports = model('Topics', topicsSchema)
