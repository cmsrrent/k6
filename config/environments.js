// Select with: k6 run -e ENV=staging ...  (default: dev)
const environments = {
  local: { baseUrl: 'http://localhost:3000' },
  dev: { baseUrl: 'https://jsonplaceholder.typicode.com' },
  staging: { baseUrl: 'https://staging.example.com' },
};

const name = __ENV.ENV || 'dev';
if (!environments[name]) {
  throw new Error(`Unknown ENV "${name}". Valid: ${Object.keys(environments).join(', ')}`);
}

export const env = {
  name,
  ...environments[name],
  // BASE_URL overrides the environment default
  baseUrl: __ENV.BASE_URL || environments[name].baseUrl,
  token: __ENV.API_TOKEN || '',
};
