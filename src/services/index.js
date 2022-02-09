const config = require('../config');
const utils = require('../utils');
const db = require('../db')(config.db);
const statusCode = require('../statusCode');

function successMessage(functionMessage) {
  return {
    code: statusCode.ok,
    message: functionMessage,
  };
}

async function createUser(req) {
  req.password = utils.hashPassword(req.password);
  const newUser = await db.createUser(req);
  return successMessage(newUser);
}

async function changePassword(req) {
  const pass = utils.generatePassword();
  const user = {
    email: req.body.email,
    newPassword: utils.hashPassword(pass),
  };
  utils.sendEmailWithPassword(user.email, pass);
  const message = await db.changePassword(user);
  return successMessage(message);
}

async function checkUserPassword(body) {
  const {email: emailUser, password: passwordUser} = body;
  const userFromDB = await db.getUserByEmail(emailUser);
  if (userFromDB.length === 0) {
    throw new Error('No user was found');
  }
  const hashUserPassword = utils.hashPassword(passwordUser);
  if (hashUserPassword !== userFromDB.password) {
    throw new Error('Password is not correct');
  }
}

async function authenticateUser (body) {
    const { email } = body;
    await checkUserPassword(body);
    const accessToken = utils.generateAccessToken(email);
    const refreshToken = utils.generateRefreshToken(email);
    await db.putRefreshToken(email, refreshToken);
    if ( config.env === 'dev') {
      console.log(`Access Token: ${accessToken}`);
      console.log(`Refresh Token: ${refreshToken}`);
    }
  return accessToken;
}

async function loginCheck (body) {
  try {
    const accessToken = await authenticateUser(body);
    return successMessage(accessToken);
  } catch (err) {
    return { code: statusCode.unauthorized, message: err.message };
  }
}

module.exports = {
  createUser,
  changePassword,
  loginCheck,
};
