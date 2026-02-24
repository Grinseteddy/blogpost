'use strict';

const path = require('path');
const { Router } = require('express');
const OpenApiValidator = require('express-openapi-validator');
const { v4: uuidv4 } = require('uuid');
const store = require('../store');

const router = Router();

router.use(
  OpenApiValidator.middleware({
    apiSpec: path.join(__dirname, '../../specs/register.yaml'),
    validateRequests: true,
    validateResponses: true,
    ignoreUndocumented: true,
  })
);

// POST /cooks
router.post('/cooks', (req, res) => {
  const { name, givenName, email } = req.body;
  const cook = { id: uuidv4(), name, givenName, email };
  store.cooks.set(cook.id, cook);
  return res.status(201).json(cook);
});

// GET /cooks
router.get('/cooks', (_req, res) => {
  return res.json(Array.from(store.cooks.values()));
});

// GET /cooks/:cookId
router.get('/cooks/:cookId', (req, res) => {
  const cook = store.cooks.get(req.params.cookId);
  if (!cook) {
    return res.status(404).json({ message: `Cook '${req.params.cookId}' not found.` });
  }
  return res.json(cook);
});

module.exports = router;
