import { group, sleep } from 'k6';
import { SharedArray } from 'k6/data';
import { buildOptions } from '../config/options.js';
import { ApiClient } from '../lib/client.js';
import { PostsApi } from '../api/posts.js';

export const options = buildOptions('smoke');

// Loaded once and shared across all VUs
const posts = new SharedArray('posts', () => JSON.parse(open('../data/posts.json')));

export default function () {
  const api = new PostsApi(new ApiClient());
  const payload = posts[(__VU + __ITER) % posts.length];

  group('read', () => {
    api.list();
    api.get(1);
  });

  group('write', () => {
    api.create(payload);
    api.update(1, { ...payload, id: 1 });
    api.remove(1);
  });

  sleep(1);
}
