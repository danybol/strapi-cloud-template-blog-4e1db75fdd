'use strict';

/**
 * `isPatientOwner` middleware
 */

module.exports = (config, { strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    strapi.log.info('In isPatientOwner middleware.');
    const user = ctx.state.user
    const entryId = ctx.params.id ? ctx.params.id : undefined
    let entry = {}

    if (entryId) {
      entry = await strapi.entityService.findOne()
    }

    await next();
  };
};
