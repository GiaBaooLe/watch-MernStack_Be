const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const memberSchema = new Schema({
  membername: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  YOB: { type: Number },
  isAdmin: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Member', memberSchema);
