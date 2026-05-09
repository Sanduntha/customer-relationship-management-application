const express = require('express');
const router = express.Router();
const { login, getMe, getUsers } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

router.post('/login', login);
router.get('/me', authenticate, getMe);
router.get('/users', authenticate, getUsers);

module.exports = router;
