import { z } from 'zod';

export const SendContactSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  content: z.string(),
});
