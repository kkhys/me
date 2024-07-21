import { BaseError } from './base';

/**
 * Represents an error that occurs during the reCAPTCHA verification process.
 *
 * @extends BaseError
 */
export class RecaptchaError extends BaseError {
  constructor(message: string) {
    super(message);
  }
}

/**
 * Represents an error that occurs while interacting with Google Sheets.
 *
 * @extends BaseError
 */
export class GoogleSheetsError extends BaseError {
  constructor(message: string) {
    super(message);
  }
}
