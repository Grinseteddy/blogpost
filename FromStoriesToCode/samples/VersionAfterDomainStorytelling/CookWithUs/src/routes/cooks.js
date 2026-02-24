const express = require('express');
const { store, newId } = require('../store');

const router = express.Router();

// POST /register
router.post('/register', (req, res) => {
  const { email } = req.body;

  if (store.cooks.find((c) => c.email === email)) {
    return res.status(409).json({ error: 'A cook with this email already exists.' });
  }

  const cook = { id: newId(), email };
  store.cooks.push(cook);
  res.status(201).json(cook);
});

// GET /cooks/:cookId
router.get('/cooks/:cookId', (req, res) => {
  const cook = store.cooks.find((c) => c.id === req.params.cookId);
  if (!cook) return res.status(404).json({ error: 'Cook not found.' });
  res.json(cook);
});

module.exports = router;
