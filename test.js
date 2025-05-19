import { murmurhash3_32 } from './pkg/murmurhash_rs.js';

if (murmurhash3_32(new TextEncoder().encode('hello'), 0) !== 613153351) {
  throw new Error('hash result mismatch');
}
console.log('JS test passed');
