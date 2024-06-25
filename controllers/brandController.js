const Brand = require('../models/brand');
const Watch = require('../models/watch');

exports.getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find();
    res.json(brands);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createBrand = async (req, res) => {
  const { brandName } = req.body;
  try {
    const existingBrand = await Brand.findOne({ brandName });
    if (existingBrand) {
      return res.status(400).json({ error: "Brand already exists" });
    }

    const newBrand = new Brand({ brandName });
    await newBrand.save();
    res.status(201).json(newBrand);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateBrand = async (req, res) => {
  const { brandName } = req.body;
  try {
    const updatedBrand = await Brand.findByIdAndUpdate(
      req.params.id,
      { brandName },
      { new: true }
    );
    if (!updatedBrand)
      return res.status(404).json({ error: "Brand not found" });
    res.json(updatedBrand);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteBrand = async (req, res) => {
  try {
    const deletedBrand = await Brand.findByIdAndDelete(req.params.id);
    if (!deletedBrand) return res.status(404).json({ error: "Brand not found" });
    await Watch.updateMany({ brand: req.params.id }, { $set: { brand: null } });

    res.json({ message: "Brand deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
