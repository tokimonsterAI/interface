import {Theme, ThemeUIStyleObject} from 'theme-ui';

import {contentHolderSx} from 'src/components/basic-ui/tabs';
import {zIndex} from 'src/constants';

import colors from './colors';

const baseContainer: ThemeUIStyleObject = {
    margin: '0 auto',
    paddingLeft: 4,
    paddingRight: 4,
    maxWidth: 1200
};

export const formCellPaddingX = '30px';

const formCell: ThemeUIStyleObject = {
    display: 'block',
    boxSizing: 'border-box',
    paddingY: '0px',
    paddingX: formCellPaddingX,
    height: '60px',
    flexShrink: 0,
    fontSize: '18px',
    fontWeight: 500,
    borderRadius: '4px',
    color: '#000'
};

const baseButton: ThemeUIStyleObject = {
    ...formCell,

    'color': '#fff',
    'cursor': 'pointer',
    'userSelect': 'none',
    'textAlign': 'center',

    '&:disabled': {
        cursor: 'not-allowed',
        filter: 'brightness(80%)'
    },

    '&:hover:not(:disabled)': {
        filter: 'brightness(95%)'
    },

    '&:active:not(:disabled)': {
        filter: 'brightness(90%)'
    }
};

const claimButton: ThemeUIStyleObject = {
    ...baseButton,
    px: '8px',
    width: ['100%', 'auto'],
    minWidth: '60px',
    height: '30px',
    lineHeight: '30px',
    gridColumn: ['1/-1', 'span 1'], // coordinated with theme layout.poolHeaderInfoBox

    fontSize: '12px',
};

const formButton: ThemeUIStyleObject = {
    ...baseButton,
    backgroundColor: 'primary',
    border: 'none',
    width: ['100%', 160],
    height: 50,
    mt: '30px', // formBoxTitleHeight
    borderRadius: 10
};

const overlay: ThemeUIStyleObject = {
    position: 'absolute',

    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    borderRadius: 16
};

const baseInput: ThemeUIStyleObject = {
    ...formCell,
    'backgroundColor': 'white',

    ':focus': {
        outline: 'none !important',
        boxShadow: 'unset !important'
    },

    '&[type=number]': {
        'MozAppearance': 'textfield',

        '::-webkit-inner-spin-button': {
            WebkitAppearance: 'none',
            margin: 0
        },

        '::-webkit-outer-spin-button': {
            WebkitAppearance: 'none',
            margin: 0
        },

        '::-webkit-input-placeholder': {
            color: '#aaa'
        },

        '::-moz-placeholder': {
            color: '#aaa'
        }
    }
};

const messageTip: ThemeUIStyleObject = {
    display: 'block',
    marginTop: 3,
    fontSize: '12px',
    wordBreak: 'break-word'
};

const theme: Theme = {
    breakpoints: ['480px', '1025px', '1441px'],

    space: [0, 4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 64, 128],

    colors: {
        ...colors,
        modes: {
            light: {
                background: '#f5f5f5',
                text: colors.black,
                backgroundPrimary: '#ffffff',
            },
            dark: {
                background: '#202020',
                text: colors.white,
                backgroundPrimary: '#202020',
            }
        }
    },

    fonts: {
        body: '"DIN", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
        heading: 'inherit'
    },

    fontWeights: {
        heading: 500
    },

    lineHeights: {
        heading: 1.5
    },

    layout: {
        container: baseContainer,

        header: {
            position: ['sticky', 'sticky', 'fixed'],
            zIndex: zIndex.header,
            top: 0,
            mx: [0, 120],
            mt: 20,
            backgroundColor: 'backgroundPrimary',
            width: ['auto', 'auto', 'calc(100% - 240px)'],
            boxShadow: ['0px 10px 20px 0px rgba(0, 0, 0, 0.15)', '0px 64px 128px -24px rgba(0, 0, 0, 0.08), 0px 4.3px 1px -4px rgba(0, 0, 0, 0.25), 0px 48px 48px -32px rgba(8, 8, 8, 0.04), 0px 12px 26px 0px rgba(8, 8, 8, 0.03), 0px 12px 8px -8px rgba(8, 8, 8, 0.05), 0px 10px 3px -8px rgba(8, 8, 8, 0.05)'],
            borderRadius: 2048,
        },

        headerMenu: {
            overflow: 'hidden',
            py: 20, // same as border radius
            borderRadius: 20,
            boxShadow: '0px 20px 30px 0px rgba(148, 115, 115, 0.25)'
        },

        headerMenuItem: {
            px: 30,
            py: 15,
            fontSize: 2,
            fontWeight: 'bold',
            color: 'text',
        },

        poolHeaderBox: {
            display: 'flex',
            p: ['15px', 30],
            gap: 5,
            flexDirection: 'row',
            flexWrap: ['wrap', 'wrap', 'nowrap'],
            justifyContent: 'space-between',
            alignItems: ['flex-start', 'center']
        },

        poolHeaderMarket: {
            alignItems: 'center',
            width: ['100%', '100%', '300px']
        },

        poolHeaderInfoBox: {
            display: 'grid',
            gridTemplateColumns: ['1fr 1fr', '1fr 1fr 1fr 1fr 60px'],
            alignItems: 'center',
            flex: 1,
            gap: 2,
        },

        poolBodyNoTabBox: {
            ...contentHolderSx
        },

        overrideCollapse: {
            'backgroundColor': 'backgroundSecondary',
            'borderColor': 'text',
            'borderRadius': 0,
            '.ant-collapse-item': {
                'borderColor': 'text',
                ':last-child': {
                    borderRadius: 0
                }
            },
            '.ant-collapse-item > .ant-collapse-header': {
                'display': 'block',
                'p': 0,
                'pr': [0, 40],
                'color': 'text',
                ':last-child': {
                    borderRadius: 0
                }
            },
            '.ant-collapse-content': {
                'backgroundColor': 'transparent',
                'color': 'text',
                'borderColor': 'text',

                '.ant-collapse-content-box': {
                    padding: 0
                }
            },
            '.ant-collapse-item.ant-collapse-no-arrow > .ant-collapse-header': {
                paddingLeft: 0
            }
        },

        disabledOverlay: {
            ...overlay,
            bg: 'rgba(0, 0, 0, 0.5)'
        },

        summaryDataTitle: {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            color: 'textPrimary',
            fontSize: 16,
            fontWeight: 'bold',
            lineHeight: 1,
            whiteSpace: 'nowrap',
        }
    },

    links: {
        'headerNav': {
            'color': 'inherit',
            'fontWeight': 'bold',

            '&:hover': {
                color: 'textHover'
            },

            '&.active': {
                'position': 'relative',
                'color': 'primary',

                '&::after': {
                    content: "''",
                    display: 'block',
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '120%',
                    height: [0, 0, '4px'],
                    marginTop: '4px',
                    background: '#31ED84'
                }
            }
        },

        'reset': {
            'color': 'text',

            '&:hover': {
                color: 'textHover'
            },

            '&:active': {
                color: 'inherit'
            }
        },

        'light-bg': {
            'color': colors.primary,
            'textDecoration': 'underline',
            'filter': 'brightness(70%)',

            '&:hover': {
                color: colors.primary,
                textDecoration: 'underline',
                filter: 'brightness(80%)'
            },
        }
    },

    buttons: {
        'primary': {
            ...baseButton,

            minWidth: '240px'
        },

        'secondary': {
            ...baseButton,

            'minWidth': '240px',
            'backgroundColor': 'transparent',
            'color': 'text',
            'border': `1px solid ${colors.primary}`,

            '&:disabled': {
                cursor: 'not-allowed',
                backgroundColor: 'transparent'
            },
        },

        'transparent': {
            ...baseButton,
            color: 'text',
            backgroundColor: 'transparent',
        },

        'header-primary': {
            ...baseButton,
            height: '40px',
            fontSize: ['14px', '16px'],
            borderRadius: 20
        },

        'header-transparent': {
            ...baseButton,
            height: '40px',
            backgroundColor: 'rgba(255, 255, 255, .35)',
            color: 'text',
            borderRadius: 20
        },

        'modal-primary': {
            ...baseButton,
            fontSize: '14px',
            borderRadius: 10
        },

        'modal-secondary': {
            ...baseButton,
            fontSize: '14px',
            borderRadius: 10,
            backgroundColor: 'secondary',
            color: 'text',
        },

        'selector-item': {
            ...baseButton,
            color: 'text',
            backgroundColor: '#f1f1f1',
            width: '100%',
            borderRadius: 5
        },

        'form-box-operation': {
            ...formButton,
        },

        'form-box-operation-secondary': {
            ...formButton,
            backgroundColor: 'secondary',
        },

        'claim': {
            ...claimButton,

            'backgroundColor': 'primary',
            'border': 'none',

            '&:hover': {
                color: 'black'
            }
        },

        'claim-transparent': {
            ...claimButton,

            backgroundColor: 'transparent',
            color: 'primary',
            border: `1px solid ${colors.primary}`
        },

        'icon-transparent': {
            ...baseButton,
            display: 'inline-block',
            padding: 0,
            width: '40px',
            height: '40px',
            flexShrink: '0',
            backgroundColor: 'transparent',
            color: 'text',
            border: `1px solid ${colors.text}`,
            borderRadius: '8px',
        }
    },

    forms: {
        input: {
            ...baseInput
        },

        editInput: {
            ...baseInput,

            flex: 1,
            width: '300px',
            px: 30,

            fontSize: '18px',

            color: 'black',
            backgroundColor: 'transparent',
            border: 'unset',
            boxShadow: 'unset !important'
        },

        textarea: {
            ...baseInput,
            paddingY: '10px',
            minHeight: '120px',
            borderRadius: '10px',
        },

        label: {
            // override theme-ui default style
            width: 'auto',
            // sync styled-components.Label
            overflow: 'hidden',
            maxWidth: '100%',
            textOverflow: 'ellipsis',
            fontSize: 14
        }
    },

    cards: {
        primary: {
            position: 'relative',
            bg: 'transparent',
            border: '1px solid white',
            boxShadow: '0px 10px 30px rgba(155, 180, 208, 0.2);'
        },

        boostModal: {
            px: 20,
            py: 30,
            background: 'rgba(75, 255, 0, 0.14)',
            borderRadius: 8
        }
    },

    text: {
        heading: {
            // override antd heading color
            color: 'text'
        },

        sectionTitle: {
            variant: 'text.heading',
            marginBottom: '30px',
            fontSize: 24
        },

        description: {
            display: 'block',
            fontSize: '12px',
            color: '#999'
        },

        footerTitle: {
            fontSize: 18,
            lineHeight: '32px',
            fontWeight: 'bold',
            color: 'primary'
        },

        errorTip: {
            ...messageTip,
            color: 'red'
        },

        invalidTip: {
            ...messageTip,
            color: 'text'
        },

        infoTip: { // give info for user interaction
            ...messageTip,
            color: '#00ffdf'
        },

        infoTipReverse: {
            ...messageTip,
            color: 'black'
        },

        descriptiveTip: { // give info as default
            ...messageTip,
            color: 'text'
        },

        clickable: {
            cursor: 'pointer',
            userSelect: 'none'
        },

        primary: {
            color: 'primary'
        }
    },

    images: {
        poolHeaderIcon: {
            flexShrink: 0,
            mr: 2,
            width: 40,
        }
    },

    styles: {
        root: {
            backgroundColor: 'background',
            color: 'text',
            transition: 'all 0.3s ease',
            minHeight: '100vh'
        },
        body: {
            backgroundColor: 'background',
            color: 'text',
            transition: 'all 0.3s ease'
        },
        a: {
            'color': colors.primary,
            'textDecoration': 'underline',

            '&:hover': {
                color: colors.primary,
                textDecoration: 'underline',
                filter: 'brightness(120%)'
            },
        },
        opacityHr: {
            my: '10px',
            color: 'textSecondary',
        }
    },

    initialColorModeName: 'default',
    useColorSchemeMediaQuery: false,
};

export default theme;
