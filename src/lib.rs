const C1: u32 = 0xcc9e2d51;
const C2: u32 = 0x1b873593;

/// Compute MurmurHash3 32-bit hash of `data` using `seed`.
pub fn murmurhash3_32(data: &[u8], seed: u32) -> u32 {
    let mut hash = seed;
    let nblocks = data.len() / 4;

    for i in 0..nblocks {
        let mut k = u32::from_le_bytes([
            data[i * 4],
            data[i * 4 + 1],
            data[i * 4 + 2],
            data[i * 4 + 3],
        ]);

        k = k.wrapping_mul(C1);
        k = k.rotate_left(15);
        k = k.wrapping_mul(C2);

        hash ^= k;
        hash = hash.rotate_left(13);
        hash = hash.wrapping_mul(5).wrapping_add(0xe6546b64);
    }

    let mut k1 = 0u32;
    let tail = &data[nblocks * 4..];
    match tail.len() {
        3 => {
            k1 ^= (tail[2] as u32) << 16;
            k1 ^= (tail[1] as u32) << 8;
            k1 ^= tail[0] as u32;
        }
        2 => {
            k1 ^= (tail[1] as u32) << 8;
            k1 ^= tail[0] as u32;
        }
        1 => {
            k1 ^= tail[0] as u32;
        }
        _ => {}
    }

    if tail.len() > 0 {
        k1 = k1.wrapping_mul(C1);
        k1 = k1.rotate_left(15);
        k1 = k1.wrapping_mul(C2);
        hash ^= k1;
    }

    hash ^= data.len() as u32;

    hash ^= hash >> 16;
    hash = hash.wrapping_mul(0x85eb_ca6b);
    hash ^= hash >> 13;
    hash = hash.wrapping_mul(0xc2b2_ae35);
    hash ^= hash >> 16;

    hash
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_known_values() {
        assert_eq!(murmurhash3_32(b"hello", 0), 613153351);
        assert_eq!(murmurhash3_32(b"murmur", 1234), 32288365);
    }
}
