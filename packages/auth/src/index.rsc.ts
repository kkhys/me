import { cache } from 'react';
import NextAuth from 'next-auth';

import { authConfig } from './config';

export type { Session } from 'next-auth';

const {
  handlers: { GET, POST },
  auth: defaultAuth,
  signIn,
  signOut,
} = NextAuth(authConfig);

const auth = cache(defaultAuth);

export { GET, POST, auth, signIn, signOut };
