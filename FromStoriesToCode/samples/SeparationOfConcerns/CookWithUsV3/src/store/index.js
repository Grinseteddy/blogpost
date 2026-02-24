'use strict';

/**
 * Shared in-memory store for all bounded contexts.
 * Node.js module cache guarantees a single instance across all routers.
 */
const store = {
  /** @type {Map<string, object>} */
  cooks: new Map(),

  /** @type {Map<string, object>} */
  recipes: new Map(),

  /** @type {Map<string, object>} */
  ratings: new Map(),
};

module.exports = store;
