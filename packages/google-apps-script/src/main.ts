import { sendContactEmail } from "#/services";

declare const global: Record<string, () => void>;

global.sendContactEmail = () => sendContactEmail();
