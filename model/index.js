const fs = require('fs/promises')
const { nanoid } = require('nanoid')
const path = require('path')
const contactsPath = path.join(__dirname, './contacts.json')

async function listContacts() {
  const data = await fs.readFile(contactsPath)
  const res = JSON.parse(data)
  return res
}

async function getContactById(contactId) {
  const data = await listContacts()
  try {
    const result = data.find(({ id }) => id === contactId)
    if (!result) {
      return null
    }
    return result
  } catch (error) {
    console.error(error)
  }
}

async function removeContact(contactId) {
  const data = await listContacts()
  try {
    const idx = data.findIndex(item => item.id === contactId)
    if (idx === -1) {
      return null
    }
    const result = data.filter((_, index) => index !== idx)
    await fs.writeFile(contactsPath, JSON.stringify(result, null, 2))
    return result
  } catch (error) {
    console.error(error)
  }
}

async function addContact(body) {
  const data = await listContacts()
  try {
    const newContact = { id: nanoid(), ...body }
    data.push(newContact)
    await fs.writeFile(contactsPath, JSON.stringify(data, null, 2))
    return newContact
  } catch (error) {
    console.error(error)
  }
}

const updateContact = async (id, body) => {
  const data = await listContacts()
  const idx = data.findIndex(item => +item.id === +id)
  if (idx === -1) {
    return null
  }
  data[idx] = { id, ...body }
  await fs.writeFile(contactsPath, JSON.stringify(data, null, 2))
  return data[idx]
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
