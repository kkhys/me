import type { TRPCRouterRecord } from '@trpc/server';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { env } from '../../env';
import { publicProcedure } from '../trpc';
import { getIpHash, redis } from '../utils';

export const pageViewRouter = {
  bySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input: { slug } }) => (await redis.get<number>(['pageviews', env.NODE_ENV, slug].join(':'))) ?? 0),

  incrementViews: publicProcedure.input(z.object({ slug: z.string() })).mutation(async ({ ctx, input: { slug } }) => {
    if (!ctx.ip) {
      throw new TRPCError({ code: 'BAD_REQUEST' });
    }

    const ip = ctx.ip;
    const ipHash = await getIpHash(ip);

    const isNew = await redis.set(['deduplicate', ipHash, slug].join(':'), true, {
      nx: true,
      ex: 24 * 60 * 60,
    });

    if (!isNew) {
      return 'Deduplicated';
    }

    await redis.incr(['pageviews', env.NODE_ENV, slug].join(':'));

    return 'Incremented';
  }),

  import: publicProcedure.mutation(async ({ ctx }) => {
    const posts = await ctx.db.query.posts.findMany();
    posts.forEach((post) => void redis.setnx(['pageviews', 'production', post.slug].join(':'), post.views));
  }),
} satisfies TRPCRouterRecord;
