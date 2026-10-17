# k6 API Test Framework

[![k6 smoke](https://github.com/cmsrrent/k6/actions/workflows/k6.yml/badge.svg?branch=master)](https://github.com/cmsrrent/k6/actions/workflows/k6.yml)
![k6](https://img.shields.io/badge/k6-performance%20testing-7D64FF?logo=k6&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES%20modules-F7DF1E?logo=javascript&logoColor=black)
[![Grafana](https://img.shields.io/badge/metrics-Grafana-F46800?logo=grafana&logoColor=white)](https://grafana.com/)
[![Prometheus](https://img.shields.io/badge/metrics-Prometheus-E6522C?logo=prometheus&logoColor=white)](https://prometheus.io/)

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
k6 run tests/posts.test.js                                  # smoke profile by default
k6 run -e PROFILE=load tests/posts.test.js                  # choose a profile
k6 run -e ENV=staging -e API_TOKEN=xxx tests/posts.test.js  # other env + auth
k6 run -e BASE_URL=http://localhost:8080 tests/posts.test.js
```

The project includes these profiles, selectable with `-e PROFILE=<name>`:

| Profile | Load pattern | Intended use |
| --- | --- | --- |
| `smoke` | 1 virtual user (VU) for 30 seconds | Confirm the test and target API work with a minimal load |
| `load` | Ramp to 20 VUs over 1 minute, hold for 3 minutes, then ramp down over 30 seconds | Check behavior under expected, steady traffic |
| `stress` | Ramp to 50 VUs over 2 minutes, then 100 over 3 minutes, then 200 over 3 minutes, and ramp down over 2 minutes | Observe behavior as load increases beyond normal levels |
| `spike` | Ramp to 10 VUs over 30 seconds, jump to 300 over 30 seconds, return to 10 over 1 minute, then ramp down over 30 seconds | Check how the API responds to a sudden traffic burst |
| `soak` | Ramp to 30 VUs over 2 minutes, hold for 1 hour, then ramp down over 2 minutes | Look for issues that emerge during sustained traffic |

Each profile uses the same default thresholds: fewer than 1% failed HTTP requests,
95th-percentile request duration below 500 ms, 99th-percentile duration below
1000 ms, and a check success rate above 99%. A run fails its thresholds if any
of these conditions are not met. Thresholds and profile stages are defined in
[`config/options.js`](./config/options.js).

Convenience npm scripts are also available: `npm run test:smoke`,
`npm run test:load`, `npm run test:stress`, `npm run test:spike`, and
`npm run test:soak`. Use `npm run test:load:metrics` to run the load profile
while sending its metrics to the local Prometheus/Grafana stack.

## Viewing load-test metrics in Grafana

The local metrics stack runs Prometheus and Grafana in Docker. Start it with:

```sh
npm run metrics:up
```

Then run a load test with Prometheus remote-write output enabled:

```sh
npm run test:load:metrics
```

Open [http://localhost:3000](http://localhost:3000), sign in with `admin` / `admin`,
and open the **k6 Load Test Overview** dashboard in the **k6** folder. Prometheus
is available at [http://localhost:9090](http://localhost:9090). The dashboard
shows request duration percentiles, throughput, failed-request rate, and virtual
users. Metrics are retained locally for 30 days.

To stop the services, run `npm run metrics:down`. This keeps the stored metrics
and Grafana data; `docker compose down -v` removes both data volumes.

The local metrics stack is intended for development and binds its ports to
localhost. `test:load:metrics` requires Docker Compose and k6 to be installed.

## Adding a test

1. Create `api/<resource>.js` modelled on `api/posts.js`.
2. Create `tests/<resource>.test.js` with `export const options = buildOptions('smoke')`.
3. Tune thresholds in `config/options.js` (or pass overrides as the second argument of `buildOptions`).

The sample targets the public JSONPlaceholder API (`ENV=dev`); point `environments.js` at your own service.
