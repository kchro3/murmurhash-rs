use std::time::Instant;
use murmurhash_rs::murmurhash3_32;

fn main() {
    let data = b"hello world";
    let iterations = 1_000_000;
    let start = Instant::now();
    for _ in 0..iterations {
        let _ = murmurhash3_32(data, 0);
    }
    let elapsed = start.elapsed();
    println!("{} iterations in {:?}", iterations, elapsed);
}
