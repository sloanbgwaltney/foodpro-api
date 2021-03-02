// Initializes the `user-password` service on path `/password`
const { UserPassword } = require('./user-password.class');
const hooks = require('./user-password.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/password', new UserPassword(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('password');

  service.hooks(hooks);
};
