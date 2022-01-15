const express = require('express');
const router = express.Router();
const contacts = require('../../controllers/contacts');
const { authenticate } = require('../../middlewares');

router.get('/', authenticate, contacts.listContacts);

router.get('/:id', authenticate, contacts.getContactById);

router.post('/', authenticate, contacts.addContact);

router.delete('/:id', authenticate, contacts.removeContact);

router.put('/:id', authenticate, contacts.updateContact);

router.patch('/:id/favorite', authenticate, contacts.updateStatusContact);

module.exports = router;
