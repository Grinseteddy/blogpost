'use strict';

const path = require('path');
const express = require('express');
const OpenApiValidator = require('express-openapi-validator');

const cooksRouter = require('./routes/cooks');
const recipesRouter = require('./routes/recipes');
const ratingsRouter = require('./routes/ratings');

const app = express();

// ---------------------------------------------------------------------------
// Body parsing
// ---------------------------------------------------------------------------
app.use(express.json());

// ---------------------------------------------------------------------------
// OpenAPI request/response validation
// express-openapi-validator validates every inbound request and every outbound
// response against the spec before our handlers run / after they respond.
// ---------------------------------------------------------------------------
app.use(
  OpenApiValidator.middleware({
    apiSpec: path.join(__dirname, '..', 'openapi.yaml'),
    validateRequests: true,
    validateResponses: true,
    // Resolve $ref internally; no external file serving needed.
    ignorePaths: /^(?!\/api\/v2)/,
  })
);

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
app.use('/api/v2/cooks', cooksRouter);
app.use('/api/v2/recipes', recipesRouter);
// Ratings are nested under recipes; mergeParams is set on the ratings router.
app.use('/api/v2/recipes/:recipeId/ratings', ratingsRouter);

// ---------------------------------------------------------------------------
// OpenAPI validation error handler
// express-openapi-validator calls next(err) with a structured error when
// validation fails.  We map it to our standard Error schema.
// ---------------------------------------------------------------------------
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  const status = err.status ?? 500;
  const message = err.message ?? 'Internal server error';
  return res.status(status).json({ message });
});

module.exports = app;
