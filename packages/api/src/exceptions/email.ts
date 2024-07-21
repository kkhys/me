import { BaseError } from './base';

/**
 * Represents an error related to sending or receiving mails.
 *
 * @extends BaseError
 */
export class EmailError extends BaseError {
  constructor(message: string) {
    super(message);
  }
}
