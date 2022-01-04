const express = require('express');
const users = require('../../controllers/users');
const { authenticate } = require('../../middlewares');
const router = express.Router();

router.post('/signup', users.signup);

router.post('/login', users.login);

router.get('/logout', authenticate, users.logout);

router.get('/current', authenticate, users.currentUser);

router.patch('/', authenticate, users.updateSubscription);

module.exports = router;
