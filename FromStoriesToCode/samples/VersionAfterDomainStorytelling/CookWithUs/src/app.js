const path = require('path');
const express = require('express');
const OpenApiValidator = require('express-openapi-validator');

const cookRoutes = require('./routes/cooks');
const recipeRoutes = require('./routes/recipes');
const ratingRoutes = require('./routes/ratings');
const mealRoutes = require('./routes/meals');

const app = express();

app.use(express.json());

// Validate all requests and responses against openapi.yaml
app.use(
  OpenApiValidator.middleware({
    apiSpec: path.join(__dirname, '..', 'openapi.yaml'),
    validateRequests: true,
    validateResponses: false, // set true during development to catch spec drift
  })
);

app.use('/', cookRoutes);
app.use('/', recipeRoutes);
app.use('/', ratingRoutes);
app.use('/', mealRoutes);

// OpenAPI validation errors
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`CookWithUs API running on http://localhost:${PORT}`);
});

module.exports = app;
