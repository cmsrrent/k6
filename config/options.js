// Reusable thresholds and load profiles. Select with: -e PROFILE=smoke|load|stress|spike|soak
export const thresholds = {
  http_req_failed: ['rate<0.01'],
  http_req_duration: ['p(95)<500', 'p(99)<1000'],
  checks: ['rate>0.99'],
};

const profiles = {
  smoke: {
    vus: 1,
    duration: '30s',
  },
  load: {
    stages: [
      { duration: '1m', target: 20 },
      { duration: '3m', target: 20 },
      { duration: '30s', target: 0 },
    ],
  },
  stress: {
    stages: [
      { duration: '2m', target: 50 },
      { duration: '3m', target: 100 },
      { duration: '3m', target: 200 },
      { duration: '2m', target: 0 },
    ],
  },
  spike: {
    stages: [
      { duration: '30s', target: 10 },
      { duration: '30s', target: 300 },
      { duration: '1m', target: 10 },
      { duration: '30s', target: 0 },
    ],
  },
  soak: {
    stages: [
      { duration: '2m', target: 30 },
      { duration: '1h', target: 30 },
      { duration: '2m', target: 0 },
    ],
  },
};

export function buildOptions(defaultProfile = 'smoke', extra = {}) {
  const name = __ENV.PROFILE || defaultProfile;
  if (!profiles[name]) {
    throw new Error(`Unknown PROFILE "${name}". Valid: ${Object.keys(profiles).join(', ')}`);
  }
  return { ...profiles[name], thresholds, ...extra };
}
