import type * as crypto from 'crypto';

import { generateSlug } from '../utils';

describe('generateSlug function', () => {
  it('should generate a unique slug based on the given data', () => {
    const data: crypto.BinaryLike = 'test-data';
    const slug = generateSlug(data);
    expect(slug).not.toBeNull();
    expect(slug.length).toEqual(9);
  });

  it('should generate different slugs for different input data', () => {
    const data1: crypto.BinaryLike = 'test-data-1';
    const data2: crypto.BinaryLike = 'test-data-2';

    const slug1 = generateSlug(data1);
    const slug2 = generateSlug(data2);

    expect(slug1).not.toEqual(slug2);
  });

  it('should generate the same slug for the same input data', () => {
    const data: crypto.BinaryLike = 'test-data';

    const slug1 = generateSlug(data);
    const slug2 = generateSlug(data);

    expect(slug1).toEqual(slug2);
  });
});
