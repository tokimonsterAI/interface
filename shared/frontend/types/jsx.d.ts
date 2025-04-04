import {ThemeUIStyleObject} from 'theme-ui';

export * from '@ant-design/icons';
export * from 'antd';
export * from 'theme-ui';
export * from 'ethers';
export * from 'react-router-dom';

declare global {
    namespace JSX {
        interface IntrinsicAttributes {
            sx?: ThemeUIStyleObject
        }
    }

    namespace React {
        type ClassName = {className?: string};

        // FC with className
        type FCC<P = any> = FunctionComponent<P & ClassName>;
        type FCD<P = any> = FunctionComponent<PropsWithChildren<P>>;
        type FCCD<P = any> = FunctionComponent<PropsWithChildren<P> & ClassName>;

        type FCSVG = FunctionComponent<SVGProps<SVGSVGElement> & { title?: string }>;

        interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
            sx?: ThemeUIStyleObject
        }

        /**
         * @deprecated
         * react@18 FC is without children
         */
        type VFCC<P = any> = VoidFunctionComponent<P & ClassName>;
    }

    const __STAGE__: 'dev' | 'test' | 'prod'; // eslint-disable-line no-underscore-dangle
}

