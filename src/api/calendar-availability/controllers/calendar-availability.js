'use strict';

/**
 * A set of functions called "actions" for `calendar-availability`
 */

module.exports = {
  getAvailability: async (ctx, next) => {
    try {
      const { id: restaurantId} = ctx.params
      const restaurant = await strapi.entityService.findOne("api::restaurant.restaurant", restaurantId, {
        populate: ['cronofy_connection']
      })
      const cronofyApiDetail = await strapi.entityService.findOne("api::cronofy-api-detail.cronofy-api-detail", 1)
      const data = await strapi.service("api::calendar-availability.calendar-availability").getAvailability(cronofyApiDetail, restaurant)
      console.log(data)
      ctx.body = data
    } catch (err) {
      console.log(err)
      ctx.body = err
    }
  }
};
