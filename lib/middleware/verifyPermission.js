const _ = require('lodash')
const redisConnections = require('../connections/redis')
const CONSTANTS = require('../const');
const MESSAGES = require('../message');
const async = require('async')
const config = require('config');
const GroupPermissionModel = require('../models/groupPermission');
module.exports = (allowPermission) => {
  return (req, res, next) => {
    let permissionsCheck = []
    let permissions = _.get(req, 'user.permissions', []);
    let groupPermissions = _.get(req, 'user.groupPermissions', []);
    if(!permissions.length && !groupPermissions.length) {
      return res.json({
        code: CONSTANTS.CODE.ROLE_BLOCK,
        message: MESSAGES.USER.ROLE_BLOCK
      })
    }
    permissions.map((permission) => {
      permissionsCheck.push(permission.code)
    })

    if(permissionsCheck.includes('admin-all')) {
      return next();
    }

    if(groupPermissions.length) {
      GroupPermissionModel
      .find({
        _id: {$in:groupPermissions}
      })
      .populate('permissions','code')
      .lean()
      .exec((err, results) => {
        if(err) {
          return res.json({
            code: CONSTANTS.CODE.ROLE_BLOCK,
            message: MESSAGES.USER.ROLE_BLOCK
          })
        }
        results.map((groupPermission) => {
          if(groupPermission.permissions.length) {
            groupPermission.permissions.map((permission) => {
              if(!permissionsCheck.includes(permission.code)) {
                permissionsCheck.push(permission.code)
              }
            })
          }
        })

        if(permissionsCheck.includes('admin-all')) {
          return next();
        }

        if(!permissionsCheck.includes(allowPermission)) {
          return res.json({
            code: CONSTANTS.CODE.ROLE_BLOCK,
            message: MESSAGES.USER.ROLE_BLOCK
          })
        }
        next();

      })
    } else {

      if(!permissionsCheck.includes(allowPermission)) {
        return res.json({
          code: CONSTANTS.CODE.ROLE_BLOCK,
          message: MESSAGES.USER.ROLE_BLOCK
        })
      }
      next();
    }
  }
}