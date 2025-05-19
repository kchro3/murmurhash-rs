const wasm = require('./murmurhash_rs.js');

if (wasm.hash('hello', 0) !== 613153351) {
  throw new Error('hash result mismatch');
}
console.log('JS test passed');
