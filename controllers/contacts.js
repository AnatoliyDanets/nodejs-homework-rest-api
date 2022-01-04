const { schema } = require('../model/contact');

const { Contact } = require('../model');

const listContacts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { _id } = req.user;
    const { favorite } = req.query;
    const skip = (page - 1) * limit;

    const result = await Contact.find(
      {
        owner: _id,
        ...(favorite && { favorite }),
      },
      '-createdAt -updatedAt',
      {
        skip,
        limit: +limit,
      },
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getContactById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await Contact.findById(id);
    if (!result) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const addContact = async (req, res, next) => {
  try {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: 'missing required name field' });
    }
    const { _id } = req.user;
    res.status(201).json(await Contact.create({ ...req.body, owner: _id }));
  } catch (error) {
    next(error);
  }
};

const removeContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByIdAndRemove(id);
    if (!contact) {
      return res.status(404).json({ message: 'Not Found' });
    }
    res.json({ message: 'contact delete' });
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: 'missing fields' });
    }
    const { id } = req.params;
    const contact = await Contact.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!contact) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.json(contact);
  } catch (error) {
    next(error);
  }
};
const updateStatusContact = async (req, res, next) => {
  try {
    const { favorite } = req.body;
    if (!req.body.hasOwnProperty('favorite')) {
      return res.status(400).json({ message: 'missing field favorite' });
    }
    const { id } = req.params;

    const contact = await Contact.findByIdAndUpdate(
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
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
