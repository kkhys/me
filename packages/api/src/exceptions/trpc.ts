import type { TRPC_ERROR_CODE_KEY } from '@trpc/server/rpc';
import { TRPCError } from '@trpc/server';

/**
 * Custom error class for handling base errors.
 *
 * @extends Error
 */
class trpcErrorBase extends TRPCError {
  constructor({
    code,
    message,
    cause,
  }: {
    message?: string;
    code: TRPC_ERROR_CODE_KEY;
    cause?: Error;
  }) {
    super({ code, message, cause });
    this.name = this.constructor.name;
  }
}

/**
 * CustomTrpcError class represents a custom error for trpc - TypeScript RPC library.
 *
 * @extends trpcErrorBase
 */
export class CustomTrpcError extends trpcErrorBase {
  constructor(message: string, cause?: Error) {
    super({ code: 'INTERNAL_SERVER_ERROR', message, cause });
  }
}
