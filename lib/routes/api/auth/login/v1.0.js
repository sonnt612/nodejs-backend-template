const _ = require('lodash');
const async = require('async');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const redisConnection = require('../../../../connections/redis');
const CONSTANTS = require('../../../../const');
const MESSAGES = require('../../../../message');

module.exports = (req, res) => {
  const { username, password } = req.body;
  let userInf;

  const checkParams = (next) => {
    if (!username || !password) {
      return next({
        code: CONSTANTS.CODE.WRONG_PARAMS,
        message: MESSAGES.SYSTEM.WRONG_PARAMS
      });
    }
    next();
  };

  const findUser = (next) => {
    UserModel.findOne({
      username,
      status: 1
    })
    .lean()
    .exec((err, user) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return next({
          code: CONSTANTS.CODE.WRONG_PARAMS,
          message: MESSAGES.USER.NOT_EXISTS
        });
      }

      userInf = user;
      next();
    });
  };

  const checkPassword = (next) => {
    bcrypt.compare(password, userInf.password, (err, isMatch) => {
      if (err) {
        return next(err);
      }

      if (!isMatch) {
        return next({
          code: CONSTANTS.CODE.WRONG_PARAMS,
          message: MESSAGES.USER.INCORRECT_PASSWORD
        });
      }

      next();
    });
  };

  const deleteOldToken = (next) => {
    const userId = userInf._id.toHexString();
    redisConnection('master')
      .getConnection()
      .get(`user:${userId}`, (err, token) => {
        if (err) {
          return next(err);
        }

        if (token) {
          redisConnection('master')
            .getConnection()
            .del(`user:${token}`, (err, result) => {
              if (err) {
                return next(err);
              }
              next();
            });
        } else {
          next();
        }
      });
  };

  const createNewToken = (next) => {
    const token = jwt.sign({ username, id: userInf._id }, config.secretKey);
    const userId = userInf._id.toHexString();
    const objSign = {
      id: userId,
      role: userInf.role,
    };

    redisConnection('master')
      .getConnection()
      .multi()
      .set(`user:${userId}`, token)
      .set(`user:${token}`, JSON.stringify(objSign))
      .exec((err, result) => {
        if (err) {
          return next(err);
        }

        const data = _.merge({}, userInf, { token });
        _.unset(data, 'password');
        
        next(null, {
          code: CONSTANTS.CODE.SUCCESS,
          data,
        });
      });
  };

  async.waterfall([checkParams, findUser, checkPassword, deleteOldToken, createNewToken], (err, data) => {
    err &&
      _.isError(err) &&
      (data = {
        code: CONSTANTS.CODE.SYSTEM_ERROR,
        message: MESSAGES.SYSTEM.ERROR,
      });

    res.json(data || err);
  });
};
