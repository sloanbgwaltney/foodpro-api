const Email = require('email-templates');
const path = require('path');
module.exports = function (app) {
  app.service('users').on('created', async user => {
    try {
      const email = new Email({ message: { from: app.get('email').accountsEmail, to: user.email }, transport: { jsonTransport: true } });
      await email.send({ template: path.resolve(__dirname, '../../emails/welcome'), locals: { user } });
    } catch (e) {
      console.log(e);
    }
  });
};
