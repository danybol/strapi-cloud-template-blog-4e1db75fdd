'use strict';

/**
 * `isPatientOwner` middleware
 */

module.exports = (config, { strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    strapi.log.info('In isPatientOwner middleware.');

    await next();
  };
};
