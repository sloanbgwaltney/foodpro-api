const { authenticate } = require('@feathersjs/authentication').hooks;
const uuid = require('uuid');
const path = require('path');
const {
  hashPassword, protect
} = require('@feathersjs/authentication-local').hooks;
const Email = require('email-templates');
const setContext = require('../../hooks/setContext');

module.exports = {
  before: {
    all: [],
    find: [authenticate('jwt')],
    get: [authenticate('jwt')],
    create: [
      hashPassword('password'),
      setContext('data', 'emailVerificationToken', uuid.v4())
    ],
    update: [hashPassword('password'), authenticate('jwt')],
    patch: [hashPassword('password'), authenticate('jwt')],
    remove: [authenticate('jwt')]
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password', 'emailVerificationToken')
    ],
    find: [],
    get: [],
    create: [
      // I think this should be on event listeners, however, docs have it like this. I will revist later
      async ctx => {
        try {
          const email = new Email({ message: { from: ctx.app.get('email').accountsEmail, to: ctx.data.email }, transport: { jsonTransport: true } });
          await email.send({ template: path.resolve(__dirname, '../../emails/welcome'), locals: { user: ctx.data } });
        } catch (e) {
          console.log(e);
        }
      }
    ],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
