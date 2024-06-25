const mongoose = require('mongoose');
const Watch = require('../models/watch');
const Member = require('../models/member');


exports.getAllWatches = async (req, res) => {
  try {
    const watches = await Watch.find().populate('brand', 'brandName');
    res.json(watches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getWatchById = async (req, res) => {
  try {
    const watch = await Watch.findById(req.params.id)
      .populate('brand', 'brandName')
      .populate('comments.author', 'membername');
    if (!watch) return res.status(404).json({ error: 'Watch not found' });
    res.json(watch);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.createWatch = async (req, res) => {
  const { watchName, image, price, automatic, watchDescription, brand } = req.body;
  try {
   
    const existingWatch = await Watch.findOne({ watchName });
    if (existingWatch) {
      return res.status(400).json({ error: 'WatchName already exists' });
    }

  
    const newWatch = new Watch({ watchName, image, price, automatic, watchDescription, brand });
    await newWatch.save();
    res.status(201).json(newWatch);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateWatch = async (req, res) => {
  const { watchName, image, price, automatic, watchDescription, brand } = req.body;
  try {
    const updatedWatch = await Watch.findByIdAndUpdate(req.params.id, { watchName, image, price, automatic, watchDescription, brand }, { new: true });
    if (!updatedWatch) return res.status(404).json({ error: 'Watch not found' });
    res.json(updatedWatch);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.deleteWatch = async (req, res) => {
  try {
    const deletedWatch = await Watch.findByIdAndDelete(req.params.id);
    if (!deletedWatch) return res.status(404).json({ error: 'Watch not found' });
    res.json({ message: 'Watch deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.addCommentToWatch = async (req, res) => {
  const { rating, content } = req.body;
  try {
    const watch = await Watch.findById(req.params.id);
    if (!watch) {
      return res.status(404).json({ error: 'Watch not found' });
    }
    if (req.member.isAdmin) {
      return res.status(400).json({ error: 'Admin cannot comment' });
    }
    const existingComment = watch.comments.find(comment => comment.author.toString() === req.member._id.toString());
    if (existingComment) {
      return res.status(400).json({ error: 'You have already commented' });
    }
    const newComment = {
      rating,
      content,
      author: req.member._id,
      
    };
    watch.comments.push(newComment);
    await watch.save();
    await watch.populate('comments.author', 'membername'); 
    res.status(201).json(watch);
  } catch (err) {
    console.error('Error adding comment:', err); 
    res.status(500).json({ error: err.message });
  }
};
