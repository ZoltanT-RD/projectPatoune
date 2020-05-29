import { configure, addDecorator } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { addParameters } from '@storybook/react';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

import { DocsPage, DocsContainer } from '@storybook/addon-docs/blocks';

import materializeCSS from '../node_modules/materialize-css/dist/css/materialize.min.css';

const newViewports = {
    kindleFire2: {
        name: 'Kindle Fire 2',
        styles: {
            width: '600px',
            height: '963px',
        },
    },
    kindleFireHD: {
        name: 'Kindle Fire HD',
        styles: {
            width: '533px',
            height: '801px',
        },
    },
};

addParameters({
    viewport: {
        viewports: {
            ...INITIAL_VIEWPORTS,
            ...newViewports,
        },
    },
    docs: {
        container: DocsContainer,
        page: DocsPage,
    }
});


//configure(require.context('../src', true, /\.stories\.js$/), module);
configure(require.context('../FrontEnd/src', true, /\.stories\.(js|mdx)$/), module);

addDecorator(withKnobs);
