const express = require('express');
const controllers = require('../controllers');
const { joiValidator} = require('../middlewares');
const schemas = require('../../schemas');

const auth = express.Router();

auth.post(
  '/registration',
  joiValidator(schemas.userSchema, 'body'),
  async(req, res, next) => {
    try {
      await controllers.createUser(req, res);
    } catch (err) {
      next(err);
    }
});

auth.post(
  '/login',
  joiValidator(schemas.schemaLogin, 'body'),
  async (req, res, next) => {
    try {
      await controllers.loginCheck(req, res);
    } catch (err) {
      next(err);
    }
});

auth.post(
  '/login/forgotten',
  joiValidator(schemas.schemaLoginForgotten, 'body'),
  async (req, res, next) => {
    try {
      await controllers.changePassword(req, res);
    } catch (err) {
      next(err);
    }
});

module.exports = auth;
