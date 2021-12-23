const express = require('express');
const router = express.Router();
const { schema } = require('../../model/contact');
const contacts = require('../../model/');

router.get('/', async (req, res, next) => {
  try {
    res.status(200).json(await contacts.listContacts());
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await contacts.getContactById(id);
    if (!result) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: 'missing required name field' });
    }
    res.status(201).json(await contacts.addContact(req.body));
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await contacts.removeContact(id);
    if (!contact) {
      return res.status(404).json({ message: 'Not Found' });
    }
    res.json({ message: 'contact delete' });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: 'missing fields' });
    }
    const { id } = req.params;
    const contact = await contacts.updateContact(id, req.body, {
      new: true,
    });
    if (!contact) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.json(contact);
  } catch (error) {
    next(error);
  }
});
router.patch('/:id/favorite', async (req, res, next) => {
  try {
    const { favorite } = req.body;
    if (!req.body.hasOwnProperty('favorite')) {
      return res.status(400).json({ message: 'missing field favorite' });
    }
    const { id } = req.params;

    const contact = await contacts.updateStatusContact(
      id,
      { favorite },
      {
        new: true,
      },
    );

    if (!contact) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.json(contact);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
