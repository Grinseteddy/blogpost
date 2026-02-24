'use strict';

const path = require('path');
const { Router } = require('express');
const OpenApiValidator = require('express-openapi-validator');
const { v4: uuidv4 } = require('uuid');
const store = require('../store');
const cookAuth = require('../middleware/cookAuth');

const router = Router();

router.use(
  OpenApiValidator.middleware({
    apiSpec: path.join(__dirname, '../../specs/rating.yaml'),
    validateRequests: true,
    validateResponses: true,
    ignoreUndocumented: true,
  })
);

// POST /recipes/:recipeId/ratings
router.post('/recipes/:recipeId/ratings', cookAuth, (req, res) => {
  const { recipeId } = req.params;

  const recipe = store.recipes.get(recipeId);
  if (!recipe) {
    return res.status(404).json({ message: `Recipe '${recipeId}' not found.` });
  }
  if (recipe.ownerId === req.cook.id) {
    return res.status(403).json({ message: 'You cannot rate your own recipe.' });
  }

  const { stars, picture, note } = req.body;
  const rating = {
    id: uuidv4(),
    raterId: req.cook.id,
    recipeId,
    stars,
    ...(picture !== undefined && { picture }),
    ...(note !== undefined && { note }),
  };

  store.ratings.set(rating.id, rating);
  return res.status(201).json(rating);
});

// GET /recipes/:recipeId/ratings
router.get('/recipes/:recipeId/ratings', (req, res) => {
  const { recipeId } = req.params;

  if (!store.recipes.has(recipeId)) {
    return res.status(404).json({ message: `Recipe '${recipeId}' not found.` });
  }

  const ratings = Array.from(store.ratings.values()).filter(
    (r) => r.recipeId === recipeId
  );
  return res.json(ratings);
});

// GET /recipes/:recipeId/ratings/:ratingId
router.get('/recipes/:recipeId/ratings/:ratingId', (req, res) => {
  const { recipeId, ratingId } = req.params;

  if (!store.recipes.has(recipeId)) {
    return res.status(404).json({ message: `Recipe '${recipeId}' not found.` });
  }

  const rating = store.ratings.get(ratingId);
  if (!rating || rating.recipeId !== recipeId) {
    return res.status(404).json({ message: `Rating '${ratingId}' not found for recipe '${recipeId}'.` });
  }

  return res.json(rating);
});

module.exports = router;
