import crypto from 'crypto';
import bs58 from 'bs58';

export function generateSlug(data: crypto.BinaryLike) {
  const hashAlgorithm = 'sha512';
  const encoding = 'hex' satisfies crypto.BinaryToTextEncoding;
  const slugLength = 9;

  const hashValue = crypto.createHash(hashAlgorithm).update(data).digest(encoding);
  const hashArray = new Uint8Array(hashValue.length);

  for (let i = 0; i < hashValue.length; i++) {
    hashArray[i] = hashValue.charCodeAt(i);
  }

  return bs58.encode(hashArray).slice(0, slugLength);
}
