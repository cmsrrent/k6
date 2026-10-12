# k6 API Test Framework

[![k6 smoke](https://github.com/cmsrrent/qa-performance-k6/actions/workflows/k6.yml/badge.svg?branch=master)](https://github.com/cmsrrent/qa-performance-k6/actions/workflows/k6.yml)
![k6](https://img.shields.io/badge/k6-performance%20testing-7D64FF?logo=k6&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES%20modules-F7DF1E?logo=javascript&logoColor=black)

Base project for functional and performance testing of backend APIs with k6 (plain ES modules, no build step).

## Layout

| Path | Purpose |
| --- | --- |
| `config/environments.js` | Environments (`ENV`), `BASE_URL` and `API_TOKEN` overrides |
| `config/options.js` | Thresholds and load profiles (smoke/load/stress/spike/soak) |
| `lib/client.js` | HTTP client wrapper (base URL, JSON, auth header) |
| `lib/checks.js` | Reusable check helpers |
| `api/` | One module per API resource, with built-in validation |
| `data/` | Test data (loaded via `SharedArray`) |
| `tests/` | Test entry points (`*.test.js`) |

## Usage

```sh
k6 run tests/posts.test.js                                  # smoke, dev env
k6 run -e PROFILE=load tests/posts.test.js                  # load profile
k6 run -e ENV=staging -e API_TOKEN=xxx tests/posts.test.js  # other env + auth
k6 run -e BASE_URL=http://localhost:8080 tests/posts.test.js
```

Or via `npm run test:smoke | test:load | test:stress | test:spike | test:soak | report`.

## Adding a test

1. Create `api/<resource>.js` modelled on `api/posts.js`.
2. Create `tests/<resource>.test.js` with `export const options = buildOptions('smoke')`.
3. Tune thresholds in `config/options.js` (or pass overrides as the second argument of `buildOptions`).

The sample targets the public JSONPlaceholder API (`ENV=dev`); point `environments.js` at your own service.
