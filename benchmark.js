import { murmurhash3_32 } from './pkg/murmurhash_rs.js';
import murmurhash from 'murmurhash'; // npm install murmurhash
import IMurmurHash from 'imurmurhash'; // npm install imurmurhash
import { MurmurHash3 } from 'murmurhash-wasm';

// Define a variety of inputs with different characteristics
const inputs = [
  { name: 'Short string', value: 'hello' },
  { name: 'Medium string', value: 'The quick brown fox jumps over the lazy dog' },
  { name: 'Long string', value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.' },
  { name: 'Numeric string', value: '12345678901234567890' },
  { name: 'Long numeric string', value: '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890' },
  { name: 'Special chars', value: '!@#$%^&*()_+-=[]{}|;:,.<>?/~`' }
];

const iterations = 100_000;
console.log(`Benchmarking with ${iterations.toLocaleString()} iterations per input\n`);

// Helper function to measure execution time using performance.now()
function measureTime(fn) {
  const start = performance.now();
  fn();
  const end = performance.now();
  const elapsed = end - start;
  console.log(`${elapsed.toFixed(3)}ms`);
  return elapsed.toFixed(3) + 'ms';
}

// Store results for table generation
const inputResults = [];

for (const input of inputs) {
  console.log(`\nInput: "${input.name}" (${input.value.length} chars)`);
  const encoded = new TextEncoder().encode(input.value);
  
  const result = { 
    name: input.name, 
    length: input.value.length,
    times: {}
  };
  
  console.log('murmurhash-rs (WASM): ');
  result.times['murmurhash-rs'] = measureTime(() => {
    for (let i = 0; i < iterations; i++) {
      murmurhash3_32(encoded, 0);
    }
  });
  
  console.log('murmurhash (JS): ');
  result.times['murmurhash'] = measureTime(() => {
    for (let i = 0; i < iterations; i++) {
      murmurhash.v3(input.value, 0);
    }
  });
  
  console.log('imurmurhash (JS): ');
  result.times['imurmurhash'] = measureTime(() => {
    for (let i = 0; i < iterations; i++) {
      new IMurmurHash(input.value, 0).result();
    }
  });
  
  console.log('murmurhash-wasm: ');
  result.times['murmurhash-wasm'] = measureTime(() => {
    for (let i = 0; i < iterations; i++) {
      MurmurHash3.hash32(input.value, 0);
    }
  });
  
  inputResults.push(result);
}

// Test with different seed values
const seedTest = inputs[1]; // Use medium string
const encoded = new TextEncoder().encode(seedTest.value);
const seeds = [0, 42, 1234, 0xdeadbeef];

console.log('\n\nTesting different seed values:');

// Store seed test results
const seedResults = [];

for (const seed of seeds) {
  console.log(`\nSeed: ${seed}`);
  
  const result = {
    seed: seed,
    times: {}
  };
  
  console.log('murmurhash-rs (WASM): ');
  result.times['murmurhash-rs'] = measureTime(() => {
    for (let i = 0; i < iterations; i++) {
      murmurhash3_32(encoded, seed);
    }
  });
  
  console.log('murmurhash (JS): ');
  result.times['murmurhash'] = measureTime(() => {
    for (let i = 0; i < iterations; i++) {
      murmurhash.v3(seedTest.value, seed);
    }
  });
  
  console.log('imurmurhash (JS): ');
  result.times['imurmurhash'] = measureTime(() => {
    for (let i = 0; i < iterations; i++) {
      new IMurmurHash(seedTest.value, seed).result();
    }
  });
  
  console.log('murmurhash-wasm: ');
  result.times['murmurhash-wasm'] = measureTime(() => {
    for (let i = 0; i < iterations; i++) {
      MurmurHash3.hash32(seedTest.value, seed);
    }
  });
  
  seedResults.push(result);
}

// Generate markdown tables
console.log(`\n\n## Benchmark Results on ${iterations} iterations\n`);
console.log('### Input Length Comparison\n');
console.log('| Input Type | Length | murmurhash-rs (WASM) | murmurhash (JS) | imurmurhash (JS) | murmurhash-wasm |');
console.log('|------------|--------|----------------------|-----------------|------------------|-----------------|');

for (const result of inputResults) {
  // Find the fastest implementation for this input
  const times = result.times;
  const minTime = Math.min(
    parseFloat(times['murmurhash-rs']), 
    parseFloat(times['murmurhash']), 
    parseFloat(times['imurmurhash']), 
    parseFloat(times['murmurhash-wasm'])
  );
  
  // Create a copy of times with bold formatting for the fastest
  const formattedTimes = {
    'murmurhash-rs': parseFloat(times['murmurhash-rs']) === minTime ? `**${times['murmurhash-rs']}**` : times['murmurhash-rs'],
    'murmurhash': parseFloat(times['murmurhash']) === minTime ? `**${times['murmurhash']}**` : times['murmurhash'],
    'imurmurhash': parseFloat(times['imurmurhash']) === minTime ? `**${times['imurmurhash']}**` : times['imurmurhash'],
    'murmurhash-wasm': parseFloat(times['murmurhash-wasm']) === minTime ? `**${times['murmurhash-wasm']}**` : times['murmurhash-wasm']
  };
  
  console.log(`| ${result.name} | ${result.length} chars | ${formattedTimes['murmurhash-rs']} | ${formattedTimes['murmurhash']} | ${formattedTimes['imurmurhash']} | ${formattedTimes['murmurhash-wasm']} |`);
}

console.log('\n### Seed Comparison\n');
console.log('| Seed | murmurhash-rs (WASM) | murmurhash (JS) | imurmurhash (JS) | murmurhash-wasm |');
console.log('|------|----------------------|-----------------|------------------|-----------------|');

for (const result of seedResults) {
  // Find the fastest implementation for this seed
  const times = result.times;
  const minTime = Math.min(
    parseFloat(times['murmurhash-rs']), 
    parseFloat(times['murmurhash']), 
    parseFloat(times['imurmurhash']), 
    parseFloat(times['murmurhash-wasm'])
  );
  
  // Create a copy of times with bold formatting for the fastest
  const formattedTimes = {
    'murmurhash-rs': parseFloat(times['murmurhash-rs']) === minTime ? `**${times['murmurhash-rs']}**` : times['murmurhash-rs'],
    'murmurhash': parseFloat(times['murmurhash']) === minTime ? `**${times['murmurhash']}**` : times['murmurhash'],
    'imurmurhash': parseFloat(times['imurmurhash']) === minTime ? `**${times['imurmurhash']}**` : times['imurmurhash'],
    'murmurhash-wasm': parseFloat(times['murmurhash-wasm']) === minTime ? `**${times['murmurhash-wasm']}**` : times['murmurhash-wasm']
  };
  
  console.log(`| ${result.seed} | ${formattedTimes['murmurhash-rs']} | ${formattedTimes['murmurhash']} | ${formattedTimes['imurmurhash']} | ${formattedTimes['murmurhash-wasm']} |`);
}