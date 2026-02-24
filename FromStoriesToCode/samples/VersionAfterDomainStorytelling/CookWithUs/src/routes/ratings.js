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

// POST /recipes/:recipeId/ratings
router.post('/recipes/:recipeId/ratings', (req, res) => {
  const cook = resolveCook(req, res);
  if (!cook) return;

  const recipe = store.recipes.find((r) => r.id === req.params.recipeId);
  if (!recipe) return res.status(404).json({ error: 'Recipe not found.' });

  const { stars, pictures } = req.body;

  const rating = {
    id: newId(),
    cookId: cook.id,
    recipeId: recipe.id,
    stars,
    pictures: pictures || [],
  };

  store.ratings.push(rating);

  // Return RatedRecipe: recipe enriched with the submitted rating
  res.status(201).json({
    ...recipe,
    rating: { id: rating.id, stars: rating.stars, pictures: rating.pictures },
  });
});

// GET /recipes/:recipeId/ratings
router.get('/recipes/:recipeId/ratings', (req, res) => {
  const recipe = store.recipes.find((r) => r.id === req.params.recipeId);
  if (!recipe) return res.status(404).json({ error: 'Recipe not found.' });

  res.json(store.ratings.filter((r) => r.recipeId === req.params.recipeId));
});

module.exports = router;
