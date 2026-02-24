const express = require('express');
const { store, newId } = require('../store');

const router = express.Router();

function resolveCook(req, res) {
  const cook = store.cooks.find((c) => c.id === req.headers['x-cook-id']);
  if (!cook) {
    res.status(404).json({ error: 'Cook not found.' });
    return null;
  }
  return cook;
}

// POST /meals
router.post('/meals', (req, res) => {
  const cook = resolveCook(req, res);
  if (!cook) return;

  const { pictures } = req.body;

  const meal = {
    id: newId(),
    cookId: cook.id,
    pictures: pictures || [],
  };

  store.meals.push(meal);
  res.status(201).json(meal);
});

// GET /meals/:mealId
router.get('/meals/:mealId', (req, res) => {
  const meal = store.meals.find((m) => m.id === req.params.mealId);
  if (!meal) return res.status(404).json({ error: 'Meal not found.' });
  res.json(meal);
});

module.exports = router;
