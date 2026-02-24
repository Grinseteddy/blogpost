'use strict';

const store = require('../store');

/**
 * Middleware that resolves X-Cook-Id to an existing Cook and attaches it to
 * req.cook.  Routes that require an authenticated Cook must use this middleware.
 *
 * express-openapi-validator already enforces that the header is present when
 * declared as required in the spec; this middleware adds the domain-level check
 * (the Cook must actually exist in the store).
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
