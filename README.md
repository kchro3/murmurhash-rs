# murmurhash-rs

MurmurHash3 32-bit implementation compiled from Rust to WebAssembly.

## Installation

```sh
npm install murmurhash-rs
```

## Usage

```js
import { murmurhash3_32 } from 'murmurhash-rs';

const hash = murmurhash3_32(new TextEncoder().encode('hello'), 0);
console.log(hash); // 613153351
```

## API

### `murmurhash3_32(data: Uint8Array, seed: number): number`
- `data`: The input data as a `Uint8Array` (use `TextEncoder` for strings)
- `seed`: The hash seed (number)
- Returns: 32-bit hash as a number

## Benchmark Results on 100000 iterations

### Input Length Comparison

| Input Type | Length | murmurhash-rs (WASM) | murmurhash (JS) | imurmurhash (JS) | murmurhash-wasm |
|------------|--------|----------------------|-----------------|------------------|-----------------|
| Short string | 5 chars | 5.088ms | 21.302ms | **4.533ms** | 40.499ms |
| Medium string | 43 chars | **4.125ms** | 25.462ms | 8.054ms | 41.836ms |
| Long string | 268 chars | **13.881ms** | 50.673ms | 27.709ms | 78.179ms |
| Numeric string | 20 chars | 3.228ms | 20.528ms | **2.862ms** | 37.172ms |
| Long numeric string | 100 chars | **6.124ms** | 29.573ms | 10.705ms | 57.346ms |
| Special chars | 29 chars | 3.694ms | 23.922ms | **3.645ms** | 40.974ms |

### Seed Comparison

| Seed | murmurhash-rs (WASM) | murmurhash (JS) | imurmurhash (JS) | murmurhash-wasm |
|------|----------------------|-----------------|------------------|-----------------|
| 0 | **5.472ms** | 25.938ms | 9.868ms | 42.085ms |
| 42 | **4.137ms** | 23.865ms | 5.214ms | 38.814ms |
| 1234 | **5.353ms** | 24.488ms | 6.672ms | 41.079ms |
| 3735928559 | **4.037ms** | 24.263ms | 5.306ms | 41.254ms |

_Benchmark script available in `benchmark.js`._
