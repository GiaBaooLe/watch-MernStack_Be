const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');
const { authenticate, authorizedAdmin } = require('../middleware/authMiddleware');

router.get('/', brandController.getAllBrands);
router.post('/', authenticate, authorizedAdmin, brandController.createBrand);
router.put('/:id', authenticate, authorizedAdmin, brandController.updateBrand);
router.delete('/:id', authenticate, authorizedAdmin, brandController.deleteBrand);

module.exports = router;
