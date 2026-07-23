import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 50 },  // Ramp up to 50 users
    { duration: '1m', target: 50 },   // Stay at 50 users for 1 min
    { duration: '30s', target: 200 }, // Spike to 200 users (stress test)
    { duration: '1m', target: 200 },  // Stay at 200 users for 1 min
    { duration: '30s', target: 0 },   // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
    http_req_failed: ['rate<0.01'],   // Error rate must be less than 1%
  },
};

const BASE_URL = 'https://app.shadowengineer.com';

export default function () {
  // 1. Test Web App Loading
  const resWeb = http.get(`${BASE_URL}/`);
  check(resWeb, { 'web status was 200': (r) => r.status === 200 });
  
  sleep(1);

  // 2. Test Core Service Health API
  const resCore = http.get(`${BASE_URL}/api/v1/repositories`); // Will 401 unauth, but that's a valid hit
  check(resCore, { 'core API responds': (r) => r.status === 401 || r.status === 200 });

  sleep(1);
}
