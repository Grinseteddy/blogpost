'use strict';

const app = require('./app');

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`CookWithUs v3 listening on http://localhost:${PORT}`);
  console.log('Bounded-context validators:');
  console.log(`  specs/register.yaml → /api/v2/cooks`);
  console.log(`  specs/sharing.yaml  → /api/v2/recipes`);
  console.log(`  specs/rating.yaml   → /api/v2/recipes/:id/ratings`);
});
