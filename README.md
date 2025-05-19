# murmurhash-rs

`murmurhash-rs` provides a 32‑bit [MurmurHash3](https://en.wikipedia.org/wiki/MurmurHash) implementation written in Rust.

## Usage

Add the crate to your `Cargo.toml`:

```toml
murmurhash-rs = "0.1"
```

Example:

```rust
use murmurhash_rs::murmurhash3_32;

fn main() {
    let hash = murmurhash3_32(b"hello", 0);
    println!("{}", hash);
}
```

Tests can be run with `cargo test`. A simple benchmark is provided under `benches/`.

**Note:** Node bindings and publishing to npm are outside the scope of this repository.
