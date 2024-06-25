const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  rating: { type: Number, min: 1, max: 3, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "Member", required: true }
}, { timestamps: true });

const watchSchema = new Schema({
  watchName: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  automatic: { type: Boolean, default: false },
  watchDescription: { type: String, required: true },
  comments: [commentSchema],
  brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" }
}, { timestamps: true });

module.exports = mongoose.model('Watch', watchSchema);
