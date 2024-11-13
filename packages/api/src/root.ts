import {
  authRouter,
  contactRouter,
  pageViewRouter,
  postRouter,
} from './router';
import { createTRPCRouter } from './trpc';

export const appRouter = createTRPCRouter({
  auth: authRouter,
  contact: contactRouter,
  pageView: pageViewRouter,
  post: postRouter,
});

export type AppRouter = typeof appRouter;
