const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const { authenticate, authorizedAdmin } = require('../middleware/authMiddleware');


router.post('/register', memberController.register);
router.post('/auth', memberController.login);
router.post('/logout', memberController.logout);
router.get('/accounts', authenticate, authorizedAdmin, memberController.getAllUsers);
router.get('/profile', authenticate, memberController.getProfile);
router.put('/profile', authenticate, memberController.updateProfile);
router.put('/profile/change-password', authenticate, memberController.changePassword);

module.exports = router;
