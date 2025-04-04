import linaria from '@linaria/vite';
import {defineConfig, mergeConfig} from 'vite';

import getSharedViteConfig from '../../shared/frontend/config/vite';

import colors from './src/theme/colors';

const STAGE = process.env.STAGE;

const CDN_URL_MAP = {
};

const base = CDN_URL_MAP[STAGE];

export default defineConfig((...args) => {
    const projectViteConfig = {
        base,
        build: {
            rollupOptions: {
                output: {
                    manualChunks: {
                        framework: [
                            'react',
                            'react-dom',
                            'react-router-dom',
                            'lottie-web',
                            'antd'
                        ],
                    }
                }
            }
        },
        plugins: [
            linaria({
                include: ['**/*.{ts,tsx}'],
                babelOptions: {
                    presets: ['@babel/preset-typescript', '@babel/preset-react'],
                },
            })
            // Uncomment to enable bundle visualizer
            // import visualizer from 'rollup-plugin-visualizer';
            // , visualizer({
            //     open: true,
            // })
        ],
        css: {
            preprocessorOptions: {
                less: {
                    javascriptEnabled: true,
                    modifyVars: {
                        // override antd see: 
                        // https://4x.ant.design/docs/react/customize-theme-cn
                        // https://github.com/ant-design/ant-design/blob/4.x-stable/components/style/themes/default.less
                        'primary-color': colors.primary,

                        'input-padding-horizontal-lg': '30px',

                        'radio-button-bg': 'transparent',

                        'border-radius-base': '8px'
                    }
                }
            },
        },
        server: {
            port: 3006,
        },
    };

    return mergeConfig(getSharedViteConfig(...args), projectViteConfig);
});
