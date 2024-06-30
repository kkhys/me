import { env } from '../../../env';

interface RequestEvent {
  token: string;
  expectedAction?: string;
  siteKey: string;
}

interface RecaptchaRequest {
  event: RequestEvent;
}

interface TokenProperties {
  valid: boolean;
  hostname: string;
  action: string;
  createTime: string;
}

interface RiskAnalysis {
  score: number;
  reasons: string[];
}

interface ResponseEvent {
  token: string;
  siteKey: string;
  userAgent: string;
  userIpAddress: string;
  ja3: string;
  expectedAction: string;
}

interface RecaptchaResponse {
  tokenProperties: TokenProperties;
  riskAnalysis: RiskAnalysis;
  event: ResponseEvent;
  name: string;
}

export const verifyRecaptcha = async ({
  recaptchaToken,
  expectedAction,
}: {
  recaptchaToken: string;
  expectedAction: string;
}) => {
  const request = {
    event: {
      token: recaptchaToken,
      expectedAction,
      siteKey: env.RECAPTCHA_SITE_KEY,
    },
  } satisfies RecaptchaRequest;

  const response = await fetch(
    `https://recaptchaenterprise.googleapis.com/v1/projects/${env.GCP_PROJECT_ID}/assessments?key=${env.RECAPTCHA_SECRET_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    },
  );

  if (!response.ok) {
    throw new Error('Failed to verify recaptcha');
  }

  return (await response.json()) as RecaptchaResponse;
};
