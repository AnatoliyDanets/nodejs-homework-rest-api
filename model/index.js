const { Contact } = require('./contact');

async function listContacts() {
  const data = await Contact.find({});
  return data;
}

async function getContactById(contactId) {
  try {
    const result = await Contact.findById(contactId);
    if (!result) {
      return null;
    }
    return result;
  } catch (error) {
    console.error(error);
  }
}

async function addContact(body) {
  try {
    const newContact = await Contact.create(body);
    return newContact;
  } catch (error) {
    console.error(error);
  }
}

async function removeContact(contactId) {
  try {
    const contact = await Contact.findByIdAndRemove(contactId);
    return contact;
  } catch (error) {
    console.error(error);
  }
}

async function updateContact(contactId, body) {
  try {
    const contact = await Contact.findByIdAndUpdate(contactId, body, {
      new: true,
    });
    return contact;
  } catch (error) {
    console.error(error);
  }
}

async function updateStatusContact(contactId, body) {
  try {
    const contact = await Contact.findByIdAndUpdate(contactId, body, {
      new: true,
    });
    return contact;
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
