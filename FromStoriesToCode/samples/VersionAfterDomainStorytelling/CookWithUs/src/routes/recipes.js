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

// POST /recipes
router.post('/recipes', (req, res) => {
  const cook = resolveCook(req, res);
  if (!cook) return;

  const { ingredients, making, pictures } = req.body;

  const recipe = {
    id: newId(),
    cookId: cook.id,
    ingredients: ingredients.map(({ name, number, unit }) => ({ name, number, unit })),
    making: making
      .map(({ orderNo, title, description }) => ({ orderNo, title, description }))
      .sort((a, b) => a.orderNo - b.orderNo),
    pictures: pictures || [],
  };

  store.recipes.push(recipe);
  res.status(201).json(recipe);
});

// GET /recipes
router.get('/recipes', (req, res) => {
  res.json(store.recipes);
});

// GET /recipes/:recipeId
router.get('/recipes/:recipeId', (req, res) => {
  const recipe = store.recipes.find((r) => r.id === req.params.recipeId);
  if (!recipe) return res.status(404).json({ error: 'Recipe not found.' });
  res.json(recipe);
});

module.exports = router;
