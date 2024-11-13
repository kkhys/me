import { importPKCS8, SignJWT } from 'jose';

import { env } from '../../../env';

interface Token {
  access_token: string;
  expires_in: number;
  token_type: string;
}

type TokenWithExpiration = Token & {
  expires_at: number;
};

const payload = {
  iss: env.GCP_CLIENT_EMAIL,
  scope: 'https://www.googleapis.com/auth/spreadsheets',
  aud: 'https://www.googleapis.com/oauth2/v4/token',
  exp: Math.floor(Date.now() / 1000) + 60 * 60,
  iat: Math.floor(Date.now() / 1000),
};

const createToken = async () => {
  const privateKey = await importPKCS8(env.GCP_PRIVATE_KEY, 'RS256');

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'RS256' })
    .setIssuedAt()
    .setIssuer(env.GCP_CLIENT_EMAIL)
    .setAudience('https://www.googleapis.com/oauth2/v4/token')
    .setExpirationTime('1h')
    .sign(privateKey);

  const form = {
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion: token,
  };

  const tokenResponse = await fetch(
    'https://www.googleapis.com/oauth2/v4/token',
    {
      method: 'POST',
      body: JSON.stringify(form),
      headers: { 'Content-Type': 'application/json' },
    },
  );

  if (!tokenResponse.ok) {
    throw new Error('Failed to get token');
  }

  const json = (await tokenResponse.json()) as Token;

  return {
    ...json,
    expires_at: Math.floor(Date.now() / 1000) + json.expires_in,
  };
};

let token: Promise<TokenWithExpiration> | null = null;

export const authenticate = async () => {
  if (token === null) {
    token = createToken();
  }

  let resolvedToken = await token;

  if (resolvedToken.expires_at < Math.floor(Date.now() / 1000)) {
    token = createToken();
    resolvedToken = await token;
  }

  return resolvedToken;
};
