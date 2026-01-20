import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: {
      // Your OpenAPI spec endpoint - uses environment variable or defaults to localhost
      target: process.env.OPENAPI_SPEC_URL || 'http://localhost:3173/api/openapi.json'
    },
    output: {
      mode: 'tags-split',
      target: './src/api/generated',
      schemas: './src/api/generated/models',
      client: 'axios',
      httpClient: 'axios',
      override: {
        mutator: {
          path: './src/api/axios-instance.ts',
          name: 'customInstance'
        }
      }
    }
  }
});
