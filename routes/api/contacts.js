const express = require('express');
const router = express.Router();
const contacts = require('../../controllers/contacts');
const { authenticate } = require('../../middlewares');

router.get('/', authenticate, contacts.listContacts);

router.get('/:id', authenticate, contacts.getContactById);

router.post('/', authenticate, contacts.addContact);

router.delete('/:id', contacts.removeContact);

router.put('/:id', contacts.updateContact);

router.patch('/:id/favorite', contacts.updateStatusContact);

module.exports = router;
