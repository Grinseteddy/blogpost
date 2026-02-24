const BASE = '/api/v2';

async function request(method, path, { body, cookId } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (cookId) headers['X-Cook-Id'] = cookId;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let msg = `Request failed: ${res.status}`;
    try {
      const errData = await res.json();
      msg = errData.message || errData.error || msg;
    } catch (_) {
      // ignore parse failure
    }
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }

  if (res.status === 204) return null;
  return res.json();
}

// Cooks
export const registerCook = (data) => request('POST', '/cooks', { body: data });
export const getCooks = () => request('GET', '/cooks');
export const getCook = (id) => request('GET', `/cooks/${id}`);

// Recipes
export const shareRecipe = (data, cookId) => request('POST', '/recipes', { body: data, cookId });
export const getRecipes = () => request('GET', '/recipes');
export const getRecipe = (id) => request('GET', `/recipes/${id}`);

// Ratings
export const rateRecipe = (recipeId, data, cookId) =>
  request('POST', `/recipes/${recipeId}/ratings`, { body: data, cookId });
export const getRecipeRatings = (recipeId) =>
  request('GET', `/recipes/${recipeId}/ratings`);
export const getRating = (recipeId, ratingId) =>
  request('GET', `/recipes/${recipeId}/ratings/${ratingId}`);
