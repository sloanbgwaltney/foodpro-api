const { FeathersError } = require('@feathersjs/errors');

const uuid = require('uuid');
/* eslint-disable no-unused-vars */
exports.UserPassword = class UserPassword {
  constructor(options, app) {
    this.app = app;
    this.options = options || {};
  }

  async create (data, params) {
    const userService = this.app.service('users');
    const { emailOrUsername } = data;

    const userQuery = await userService.find({ query: { $or: [{ username: emailOrUsername }, { email: emailOrUsername }] } });
    // we do not want to error in case a user is treying to sniff out registered emails
    if (userQuery.total === 0) return {};

    const user = userQuery.data[0];

    await userService.patch(user._id, { passwordResetToken: uuid.v4(), passwordResetTokenExpiresAt: Date.now() + 1000 * 60 * 60 * 24 });
    return {};
  }

  async patch (id, data, params) {
    const userService = this.app.service('users');
    const { passwordResetToken, newPassword } = data;

    const userQuery = await userService.find({ query: { passwordResetToken } });
    // Again we are not telling the user that they gave an invalid token to prevent burte force attempts.
    if (userQuery.total === 0) return {};

    const user = userQuery.data[0];
    if (user.passwordResetTokenExpiresAt < Date.now()) throw new FeathersError('passwordRestTokenHasExpired please subimt another request', 'expired-token', 410);

    return userService.patch(user._id, { passwordResetToken: undefined, passwordResetTokenExpiresAt: undefined, password: newPassword });
  }
};
