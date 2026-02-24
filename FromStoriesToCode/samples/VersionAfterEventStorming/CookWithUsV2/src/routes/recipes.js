'use strict';

const { Router } = require('express');
const { v4: uuidv4 } = require('uuid');
const store = require('../store');
const cookAuth = require('../middleware/cookAuth');

const router = Router();

// POST /recipes  – Share (create) a new Recipe
router.post('/', cookAuth, (req, res) => {
  const { title, ingredients, howTo, shoppingList, servings, meal, diet, picture } = req.body;

  // Business rule: Recipe title must be unique
  const titleExists = Array.from(store.recipes.values()).some(
    (r) => r.title.toLowerCase() === title.toLowerCase()
  );
  if (titleExists) {
    return res.status(400).json({ message: `A recipe with title '${title}' already exists.` });
  }

  const recipe = {
    id: uuidv4(),
    ownerId: req.cook.id,
    title,
    ingredients,
    howTo,
    shoppingList: shoppingList ?? [],
    servings,
    meal,
    diet,
    ...(picture !== undefined && { picture }),
  };

  store.recipes.set(recipe.id, recipe);
  return res.status(201).json(recipe);
});

// GET /recipes  – List all Recipes
router.get('/', (_req, res) => {
  return res.json(Array.from(store.recipes.values()));
});

// GET /recipes/:recipeId  – Get a Recipe by ID
router.get('/:recipeId', (req, res) => {
  const recipe = store.recipes.get(req.params.recipeId);
  if (!recipe) {
    return res.status(404).json({ message: `Recipe '${req.params.recipeId}' not found.` });
  }
  return res.json(recipe);
});

module.exports = router;
