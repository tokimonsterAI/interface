import {Tabs, TabsProps} from 'antd';
import {ThemeUIStyleObject} from 'theme-ui';

const contentHolderNoPaddingSx:ThemeUIStyleObject = {
    color: 'text'
};

export const contentHolderSx:ThemeUIStyleObject = {
    px: ['15px', 30],
    py: ['50px', 60],
    pt: 20,
    ...contentHolderNoPaddingSx
};

type Props = {
    activeBackground?: 'transparent' | 'primary'
    noPadding?: boolean
}

const CustomTabs: React.FC<React.PropsWithChildren<TabsProps & Props>> & Pick<typeof Tabs, 'TabPane'> = ({
    children,

    activeBackground = 'transparent',
    noPadding,

    ...rest
}) => {
    return (
        <Tabs
            type="card"
            sx={() => ({
                '.ant-tabs-nav': {
                    'mb': 0,

                    '::before': {
                        display: 'none'
                    },

                    '.ant-tabs-nav-operations': {
                        display: 'none'
                    },

                    '.ant-tabs-nav-list': {
                        'borderRadius': 0,
                        'flex': 1,

                        '.ant-tabs-ink-bar': {
                            top: '-1px',
                            height: 4,
                            visibility: 'visible',
                            bg: 'primary'
                        },

                        '.ant-tabs-tab': {
                            'm': '0 !important',
                            'flex': 1,
                            'justifyContent': 'center',
                            'borderRadius': 0,
                            'borderColor': 'transparent',
                            'backgroundColor': 'rgba(37, 37, 37, .8)',
                            'fontSize': 1,
                            'color': 'text',
                            'transition': 'all .1s ease-in-out',

                            ':hover': {
                                backgroundColor: 'rgba(73, 73, 73, .8)',
                            },

                            '.ant-tabs-tab-btn:active': {
                                color: 'primary'
                            },

                            '&.ant-tabs-tab-active': {
                                // 'fontWeight': 'bold',
                                'backgroundColor': activeBackground,

                                '.ant-tabs-tab-btn': {
                                    color: activeBackground === 'primary' ? 'black' : 'primary'
                                }
                            }
                        }
                    },

                    '.ant-tabs-ink-bar-animated': { // disable tab slide animation when bg is primary
                        display: activeBackground === 'primary' ? 'none' : 'block'
                    }
                },
                '.ant-tabs-content-holder': {
                    ...(noPadding ? contentHolderNoPaddingSx : contentHolderSx),
                    position: 'relative'
                }
            })}
            {...rest}
        >
            {children}
        </Tabs>
    );
};

CustomTabs.TabPane = Tabs.TabPane;

const TabPane = Tabs.TabPane;

export {
    TabPane
};

export default CustomTabs;
