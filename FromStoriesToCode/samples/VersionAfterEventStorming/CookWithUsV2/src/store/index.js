'use strict';

/**
 * In-memory store for all domain objects.
 * Each map is keyed by the object's string ID.
 */
const store = {
  /** @type {Map<string, import('../types').Cook>} */
  cooks: new Map(),

  /** @type {Map<string, import('../types').Recipe>} */
  recipes: new Map(),

  /**
   * Ratings are stored flat and looked up by recipeId when needed.
   * @type {Map<string, import('../types').Rating>}
   */
  ratings: new Map(),
};

module.exports = store;
