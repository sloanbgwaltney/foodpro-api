const users = require('./users/users.service.js');
const email = require('./email/email.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(email);
};
