'use strict';

/**
 * startup service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::startup.startup');
