'use strict';

/**
 * calendar-availability service
 */

var Cronofy = require('cronofy')

module.exports = {

  getOrCreateCalendar: async (cronofyApiDetail, restaurant) => {
    try {
      var client = new Cronofy({
        client_id: cronofyApiDetail.client_id,
        client_secret: cronofyApiDetail.client_secret,
        data_center: 'uk'
      })
      console.log(restaurant.uuid)
      let res = await client.applicationCalendar({application_calendar_id: restaurant.uuid})
      var app_client = new Cronofy({
        access_token: res['access_token'],
        data_center: 'uk'
      })
      let calendars = (await app_client.listCalendars()).calendars
      console.log(calendars)
      if (!calendars.length) {
        throw new Error("No calendar")
      }
      console.log("about to create")
      let existing = await strapi.entityService.findMany("api::cronofy-connection.cronofy-connection", { filters: { application_calendar_id: restaurant.uuid }, limit: 1})
      let connection = null
      if (!existing.length) {
        connection = await strapi.entityService.create("api::cronofy-connection.cronofy-connection", {
          data: {application_calendar_id: restaurant.uuid, calendar_id: calendars[0].calendar_id, sub: res.sub}
        })
      } else {
        connection = await strapi.entityService.update("api::cronofy-connection.cronofy-connection", existing[0].id, {
          data: {calendar_id: calendars[0].calendar_id, sub: res.sub}
        })
      }
      await strapi.entityService.update("api::restaurant.restaurant", restaurant.id, {
        data: {
          cronofy_connection: connection.id
        }
      })
      return { accessToken: res['access_token'], connection: connection }
    } catch (e) {
      console.log(e)
    }
  },
  getAvailability: async (cronofyApiDetail, applicationCalendarId)  => {
    const { accessToken, connection } = await strapi.service("api::calendar-availability.calendar-availability").getOrCreateCalendar(cronofyApiDetail, applicationCalendarId)
    var app_client = new Cronofy({
      access_token: accessToken,
      data_center: 'uk'
    })
    return await app_client.availability({
      response_format: "slots",
      required_duration: {minutes: 60},
      query_periods: [
        { start: "2024-03-29T00:00:00Z", end: "2024-03-31T00:00:00Z"}
      ],
      participants: [{ members: [ {sub: connection.sub, managed_availability: true }], required: 'all'}]
    })
  }

}
