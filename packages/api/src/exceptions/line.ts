import { BaseError } from './base';

/**
 * Represents an error that occurs in relation to a line.
 *
 * @extends BaseError
 */
export class LineError extends BaseError {
  constructor(message: string) {
    super(message);
  }
}
