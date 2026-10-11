import { check } from 'k6';

export function safeJson(res) {
  try {
    return res.json();
  } catch (e) {
    return undefined;
  }
}

// Validates status, JSON content type, and optional body assertions.
// `assertions` is an object of { description: (body) => boolean }.
export function checkJson(res, expected, label, assertions = {}) {
  const body = safeJson(res);
  const fns = {
    [`${label}: status is ${expected}`]: (r) => r.status === expected,
    [`${label}: json content-type`]: (r) =>
      (r.headers['Content-Type'] || '').includes('application/json'),
  };
  for (const [desc, fn] of Object.entries(assertions)) {
    fns[`${label}: ${desc}`] = () => body !== undefined && fn(body);
  }
  return check(res, fns);
}
