import { sayHello2 } from '#/main2';

export {};

declare const global: Record<string, () => void>;

const sayHello = (target: string) => console.log(`Hello ${target}!!`);

global.greet = () => sayHello('world');
global.greet2 = () => sayHello2('world2');
