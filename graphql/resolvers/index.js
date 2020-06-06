const bookingResolver = require('./bookingResolver');
const userResolver = require('./userResolver');
// const dishResolver = require('./dishResolver');

const rootResolver = {
  ...bookingResolver,
  ...userResolver,
};

module.exports = rootResolver;