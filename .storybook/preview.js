import { action } from '@storybook/addon-actions';

global.___loader = {
  enqueue: () => {},
  hovering: () => {},
};
global.__BASE_PATH__ = '/';

window.___navigate = (pathname) => {
  action('NavigateTo:')(pathname);
};
