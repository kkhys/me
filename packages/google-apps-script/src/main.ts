import { sendContactEmail } from '#/services';

export {};

declare const global: Record<string, () => void>;

global.sendContactEmail = () => sendContactEmail();
