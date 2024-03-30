import { execSync } from 'node:child_process';
import { PlopTypes } from '@turbo/gen';

export default function generator(plop: PlopTypes.NodePlopAPI) {
  plop.setGenerator('create package', {
    description: 'Generate a new package for the kkhys.me Monorepo',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of the package? (You can skip the `@kkhys/` prefix)',
        validate: (input: string) => {
          if (input.includes('.')) {
            return 'package name cannot include an extension';
          }
          if (input.includes(' ')) {
            return 'package name cannot include spaces';
          }
          if (!input) {
            return 'package name is required';
          }
          return true;
        },
      },
      {
        type: 'input',
        name: 'deps',
        message: 'Enter a space separated list of dependencies you would like to install',
      },
    ],
    actions: [
      (answers) => {
        if ('name' in answers && typeof answers.name === 'string') {
          if (answers.name.startsWith('@kkhys/')) {
            answers.name = answers.name.replace('@kkhys/', '');
          }
        }
        return 'Config sanitized';
      },
      {
        type: 'add',
        path: 'packages/{{ name }}/package.json',
        templateFile: 'templates/package.json.hbs',
      },
      {
        type: 'add',
        path: 'packages/{{ name }}/tsconfig.json',
        templateFile: 'templates/tsconfig.json.hbs',
      },
      {
        type: 'add',
        path: 'packages/{{ name }}/index.ts',
        template: "export * from './src';",
      },
      {
        type: 'add',
        path: 'packages/{{ name }}/src/index.ts',
        template: "export const name = '{{ name }}';",
      },
      {
        type: 'modify',
        path: 'packages/{{ name }}/package.json',
        async transform(content, answers: { deps: string }) {
          const pkg = JSON.parse(content);
          for (const dep of answers.deps.split(' ').filter(Boolean)) {
            pkg.dependencies[dep] = await fetch(`https://registry.npmjs.org/-/package/${dep}/dist-tags`)
              .then((res) => res.json())
              .then((json: { latest: string }) => json.latest);
          }
          return JSON.stringify(pkg, null, 2);
        },
      },
      async (answers: { name: string }) => {
        /**
         * Install deps and format everything
         */
        execSync(`pnpm prettier --write packages/${answers.name}/** --list-different`);
        return 'Package scaffolded';
      },
    ],
  });
}
