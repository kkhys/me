import { createHash } from "node:crypto";
import { bech32m } from "bech32";

// `data` is `string`, not node:crypto's `BinaryLike`: every caller hashes
// heading text, and `BinaryLike` widens to `ArrayBuffer`, which the newer
// @types/node that @kkhys/og pulls into this program rejects in `Hash.update`.
export const generateBech32m = (data: string, prefix: string) => {
  const hashAlgorithm = "sha512";
  const encoding = "hex";
  const slugLength = 7;

  const hashValue = createHash(hashAlgorithm).update(data).digest(encoding);
  const buffer = Buffer.from(hashValue, encoding);
  const words = bech32m.toWords(buffer);

  return bech32m.encode(prefix, words, 1024).slice(0, slugLength);
};
