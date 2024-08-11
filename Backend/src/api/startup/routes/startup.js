'use strict';

/**
 * startup router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::startup.startup');
