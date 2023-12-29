/**
 * A custom error class representing a not found error.
 *
 * @extends Error
 * @class
 */
export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}
