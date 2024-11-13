import type { TRPCRouterRecord } from '@trpc/server';
import { z } from 'zod';

import { desc, eq, schema } from '@kkhys/db';

import { publicProcedure } from '../trpc';

export const postRouter = {
  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.posts.findMany({
      orderBy: desc(schema.posts.createdAt),
      limit: 10,
    });
  }),

  bySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.posts.findFirst({
        where: eq(schema.posts.slug, input.slug),
      });
    }),
} satisfies TRPCRouterRecord;
