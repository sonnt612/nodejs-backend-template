const _ = require('lodash');
const async = require('async');
const bcrypt = require('bcryptjs');
const CONSTANTS = require('../../../../const');
const MESSAGES = require('../../../../message');

module.exports = (req, res) => {
  const { username, password, email, name, phone } = req.body;
  let newUser;

  const checkParams = (next) => {
    if (!username || !password || !email || !name) {
      return next({
        code: CONSTANTS.CODE.WRONG_PARAMS,
        message: MESSAGES.SYSTEM.WRONG_PARAMS
      });
    }
    next();
  };

  const checkExistingUser = (next) => {
    UserModel.findOne({
      $or: [
        { username },
        { email }
      ]
    })
    .lean()
    .exec((err, user) => {
      if (err) {
        return next(err);
      }

      if (user) {
        return next({
          code: CONSTANTS.CODE.WRONG_PARAMS,
          message: MESSAGES.USER.EXISTS
        });
      }

      next();
    });
  };

  const createUser = (next) => {
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return next(err);
      }

      UserModel.create({
        username,
        password: hashedPassword,
        email,
        name,
        phone,
        role: 'user',
        status: 1,
        createdAt: Date.now(),
        updatedAt: Date.now()
      }, (err, user) => {
        if (err) {
          return next(err);
        }

        newUser = user;
        next();
      });
    });
  };

  const sendResponse = (next) => {
    next(null, {
      code: CONSTANTS.CODE.SUCCESS,
      message: MESSAGES.USER.CREATE_SUCCESS,
      data: {
        id: newUser._id
      }
    });
  };

  async.waterfall([checkParams, checkExistingUser, createUser, sendResponse], (err, data) => {
    err &&
      _.isError(err) &&
      (data = {
        code: CONSTANTS.CODE.SYSTEM_ERROR,
        message: MESSAGES.SYSTEM.ERROR,
      });

    res.json(data || err);
  });
};
