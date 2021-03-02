const userEventListeners = require('./services/users/user.event-listener');

module.exports = function (app) {
  userEventListeners(app);
};
