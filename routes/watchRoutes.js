const express = require('express');
const router = express.Router();
const watchController = require('../controllers/watchController');
const { authenticate, authorizedAdmin } = require('../middleware/authMiddleware');


router.get('/', watchController.getAllWatches);
router.get('/:id', watchController.getWatchById);
router.post('/',authenticate,authorizedAdmin, watchController.createWatch);
router.post('/:id/comments', authenticate, watchController.addCommentToWatch);
router.put('/:id',authenticate,authorizedAdmin, watchController.updateWatch);
router.delete('/:id',authenticate,authorizedAdmin, watchController.deleteWatch);

module.exports = router;
