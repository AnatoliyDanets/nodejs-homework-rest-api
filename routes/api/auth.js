const express = require('express');
const users = require('../../controllers/users');
const { authenticate, resizeImg } = require('../../middlewares');
const upload = require('../../middlewares/upload');

const router = express.Router();

router.post('/signup', users.signup);

router.post('/login', users.login);

router.get('/logout', authenticate, users.logout);

router.get('/current', authenticate, users.currentUser);

router.patch('/', authenticate, users.updateSubscription);

router.patch(
  '/avatars',
  authenticate,
  upload.single('avatar'),
  resizeImg,
  users.updateAvatar,
);
router.post('/verify', users.emailResendVerification);
router.get('/verify/:verificationToken', users.emailVerification);

module.exports = router;
