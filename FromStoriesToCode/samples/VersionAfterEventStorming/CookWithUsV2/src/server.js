'use strict';

const app = require('./app');

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`CookWithUs v2 listening on http://localhost:${PORT}`);
  console.log(`OpenAPI spec served via express-openapi-validator`);
});
