'use strict';

const { Router } = require('express');
const { v4: uuidv4 } = require('uuid');
const store = require('../store');

const router = Router();

// POST /cooks  – Register a new Cook
router.post('/', (req, res) => {
  const { name, givenName, email } = req.body;

  const cook = {
    id: uuidv4(),
    name,
    givenName,
    email,
  };

  store.cooks.set(cook.id, cook);
  return res.status(201).json(cook);
});

// GET /cooks  – List all Cooks
router.get('/', (_req, res) => {
  return res.json(Array.from(store.cooks.values()));
});

// GET /cooks/:cookId  – Get a Cook by ID
router.get('/:cookId', (req, res) => {
  const cook = store.cooks.get(req.params.cookId);
  if (!cook) {
    return res.status(404).json({ message: `Cook '${req.params.cookId}' not found.` });
  }
  return res.json(cook);
});

module.exports = router;
