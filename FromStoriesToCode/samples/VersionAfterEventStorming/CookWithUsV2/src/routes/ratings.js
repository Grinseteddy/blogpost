'use strict';

const { Router } = require('express');
const { v4: uuidv4 } = require('uuid');
const store = require('../store');
const cookAuth = require('../middleware/cookAuth');

// mergeParams allows access to :recipeId from the parent router
const router = Router({ mergeParams: true });

// POST /recipes/:recipeId/ratings  – Rate a Recipe
router.post('/', cookAuth, (req, res) => {
  const { recipeId } = req.params;

  const recipe = store.recipes.get(recipeId);
  if (!recipe) {
    return res.status(404).json({ message: `Recipe '${recipeId}' not found.` });
  }

  // Business rule: A Cook cannot rate their own Recipe
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

// GET /recipes/:recipeId/ratings  – List all Ratings for a Recipe
router.get('/', (req, res) => {
  const { recipeId } = req.params;

  if (!store.recipes.has(recipeId)) {
    return res.status(404).json({ message: `Recipe '${recipeId}' not found.` });
  }

  const ratings = Array.from(store.ratings.values()).filter(
    (r) => r.recipeId === recipeId
  );

  return res.json(ratings);
});

// GET /recipes/:recipeId/ratings/:ratingId  – Get a specific Rating
router.get('/:ratingId', (req, res) => {
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
