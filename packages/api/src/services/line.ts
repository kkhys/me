import { env } from '../../env';

export const sendLineMessage = async ({ message }: { message: string }) => {
  const response = await fetch('https://api.line.me/v2/bot/message/push', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.LINE_CHANNEL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      to: env.LINE_USER_ID,
      messages: [
        {
          type: 'text',
          text: message,
        },
      ],
    }),
  });

  if (!response.ok) {
    console.error('Failed to send a message to LINE');
  }

  console.log('Successfully sent a message to LINE');
};
