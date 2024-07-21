/**
 * Custom error class for handling base errors.
 *
 * @extends Error
 */
export class BaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
