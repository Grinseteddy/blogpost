'use strict';

const express = require('express');

const ratingRouter   = require('./routes/rating');
const sharingRouter  = require('./routes/sharing');
const registerRouter = require('./routes/register');

const app = express();

// Parse JSON bodies before any per-router validator runs.
app.use(express.json());

// Mount each bounded-context router at the API base path.
// Rating is mounted first because its paths (/recipes/:id/ratings) are more
// specific than Sharing's (/recipes/:id) — this matters when ignoreUndocumented
// is not used, and is good practice regardless.
app.use('/api/v2', ratingRouter);
app.use('/api/v2', sharingRouter);
app.use('/api/v2', registerRouter);

// Global error handler — catches validation errors from all three validators
// and maps them to the standard { message } Error shape.
// The four-argument signature is required by Express to recognise this as an
// error handler (even if next is unused).
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  const status  = err.status  ?? 500;
  const message = err.message ?? 'Internal server error';
  return res.status(status).json({ message });
});

module.exports = app;
