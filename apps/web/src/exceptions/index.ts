/**
 * Custom error class for handling base errors.
 *
 * @extends Error
 */
class BaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

/**
 * Represents an error indicating that a resource was not found.
 *
 * @extends BaseError
 */
export class NotFoundError extends BaseError {
  constructor(message: string) {
    super(message);
  }
}
