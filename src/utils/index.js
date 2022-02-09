const generateToken = require('./generateToken');
const hashPassword = require('./hashPassword');
const generatePassword = require('./generatePassword');
const sendEmailWithPassword = require('./sendEmailWithPassword');

module.exports = {
  ...generateToken,
  hashPassword,
  generatePassword,
  sendEmailWithPassword,
};
