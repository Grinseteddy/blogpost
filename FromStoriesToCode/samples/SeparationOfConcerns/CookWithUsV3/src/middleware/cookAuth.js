'use strict';

const store = require('../store');

/**
 * Resolves the X-Cook-Id header to a Cook object and attaches it to req.cook.
 * Returns 401 if the header is missing or the Cook is not registered.
 */
function cookAuth(req, res, next) {
  const cookId = req.headers['x-cook-id'];
  if (!cookId) {
    return res.status(401).json({ message: 'X-Cook-Id header is required.' });
  }
  const cook = store.cooks.get(cookId);
  if (!cook) {
    return res.status(401).json({ message: `Cook '${cookId}' not found. Register first.` });
  }
  req.cook = cook;
  next();
}

module.exports = cookAuth;
