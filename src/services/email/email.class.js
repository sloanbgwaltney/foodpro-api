const { NotFound } = require('@feathersjs/errors');
/* eslint-disable no-unused-vars */
exports.Email = class Email {
  constructor(options, app) {
    this.app = app;
    this.options = options || {};
  }

  async create (data, params) {
    const userService = this.app.service('users');
    const { emailVerificationToken } = data;

    const userQuery = await userService.find({ query: { emailVerificationToken } });
    if (userQuery.total === 0) throw new NotFound('Invalid emailVerificationToken');

    return userService.patch(userQuery.data[0]._id, { emailVerified: true, emailVerificationToken: undefined });
  }
};
