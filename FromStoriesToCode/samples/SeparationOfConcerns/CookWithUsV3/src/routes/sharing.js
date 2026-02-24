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
    apiSpec: path.join(__dirname, '../../specs/sharing.yaml'),
    validateRequests: true,
    validateResponses: true,
    ignoreUndocumented: true,
  })
);

// POST /recipes
router.post('/recipes', cookAuth, (req, res) => {
  const { title, ingredients, howTo, shoppingList, servings, meal, diet, picture } = req.body;

  const titleExists = Array.from(store.recipes.values()).some(
    (r) => r.title.toLowerCase() === title.toLowerCase()
  );
  if (titleExists) {
    return res.status(400).json({ message: `A recipe titled '${title}' already exists.` });
  }

  const recipe = {
    id: uuidv4(),
    ownerId: req.cook.id,
    title,
    ingredients,
    howTo,
    servings,
    meal,
    diet,
    ...(shoppingList !== undefined && { shoppingList }),
    ...(picture !== undefined && { picture }),
  };

  store.recipes.set(recipe.id, recipe);
  return res.status(201).json(recipe);
});

// GET /recipes
router.get('/recipes', (_req, res) => {
  return res.json(Array.from(store.recipes.values()));
});

// GET /recipes/:recipeId
router.get('/recipes/:recipeId', (req, res) => {
  const recipe = store.recipes.get(req.params.recipeId);
  if (!recipe) {
    return res.status(404).json({ message: `Recipe '${req.params.recipeId}' not found.` });
  }
  return res.json(recipe);
});

module.exports = router;
