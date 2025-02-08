import { env } from "#/env";

const createResponse = (message: string, status: number) =>
  new Response(message, {
    status,
    headers: {
      "Content-Type": "text/plain",
      "X-Content-Type-Options": "nosniff",
    },
  });

export const GET = async (request: Request) => {
  const webhookUrl = env.VERCEL_DEPLOY_HOOK_URL;

  if (!webhookUrl) {
    return createResponse("Deploy hook URL is missing", 500);
  }

  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return createResponse("Unauthorized", 401);
  }

  try {
    const response = await fetch(webhookUrl, { method: "POST" });

    if (response.ok) {
      return createResponse("Redeployment triggered", 200);
    }

    console.error(
      `Failed to trigger redeployment: ${response.status} ${response.statusText}`,
    );

    return createResponse("Failed to trigger redeployment", 500);
  } catch (error) {
    console.error("Error communicating with deploy hook", error);
    return createResponse("Error communicating with deploy hook", 500);
  }
};
