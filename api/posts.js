import { checkJson } from '../lib/checks.js';

// One module per API resource. Each method calls the endpoint, validates it,
// and returns the response so tests can chain results.
export class PostsApi {
  constructor(client) {
    this.client = client;
  }

  list() {
    const res = this.client.get('/posts', { tags: { name: 'GET /posts' } });
    checkJson(res, 200, 'list posts', {
      'is non-empty array': (b) => Array.isArray(b) && b.length > 0,
    });
    return res;
  }

  get(id) {
    const res = this.client.get(`/posts/${id}`, { tags: { name: 'GET /posts/{id}' } });
    checkJson(res, 200, 'get post', {
      'id matches': (b) => b.id === id,
      'has title': (b) => typeof b.title === 'string',
    });
    return res;
  }

  create(payload) {
    const res = this.client.post('/posts', payload, { tags: { name: 'POST /posts' } });
    checkJson(res, 201, 'create post', {
      'echoes title': (b) => b.title === payload.title,
      'has id': (b) => b.id !== undefined,
    });
    return res;
  }

  update(id, payload) {
    const res = this.client.put(`/posts/${id}`, payload, { tags: { name: 'PUT /posts/{id}' } });
    checkJson(res, 200, 'update post', {
      'echoes title': (b) => b.title === payload.title,
    });
    return res;
  }

  remove(id) {
    const res = this.client.del(`/posts/${id}`, { tags: { name: 'DELETE /posts/{id}' } });
    checkJson(res, 200, 'delete post');
    return res;
  }
}
