'use strict';

/**
 * food-type service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::food-type.food-type');
