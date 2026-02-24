// In-memory data store
const store = {
  cooks: [],    // { id, email }
  recipes: [],  // { id, cookId, ingredients, making, pictures }
  meals: [],    // { id, cookId, pictures }
  ratings: [],  // { id, cookId, recipeId, stars, pictures }
};

let nextId = 1;
const newId = () => String(nextId++);

module.exports = { store, newId };
