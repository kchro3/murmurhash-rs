use murmurhash_rs::murmurhash3_32;

#[test]
fn test_hash_values() {
    assert_eq!(murmurhash3_32(b"hello", 0), 613153351);
    assert_eq!(murmurhash3_32(b"murmur", 1234), 32288365);
}
