const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");

const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
};

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  const data = contacts.find((contact) => contact.id === contactId);
  return data || null;
};

const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const indexRemoveContact = contacts.findIndex(
    (contact) => contact.id === contactId
  );
  contacts.splice(indexRemoveContact, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return contacts;
};

const addContact = async (body) => {
  const contacts = await listContacts();
  const newContact = {
    id: nanoid(),
    ...body,
  };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
};

const updateContact = async (contactId, body) => {
  const contacts = await listContacts();
  const indexUpdateContact = contacts.findIndex(
    (contact) => contact.id === contactId
  );
  if (indexUpdateContact === -1) return null;
  contacts[indexUpdateContact] = { id: contactId, ...body };
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return contacts[indexUpdateContact];
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
