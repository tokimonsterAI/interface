import {css} from '@linaria/core';
import {BrowserRouter} from 'react-router-dom';
import {ThemeProvider} from 'theme-ui';

import {GlobalContextProvider} from 'src/contexts/GlobalContext';
import {CustomThemeProvider} from 'src/contexts/ThemeContext';

import WalletModal from './components/wallet/WalletModal';
import WalletSelectorModal from './components/wallet/WalletSelectorModal';
import {zIndex} from './constants';
import CustomRoute from './route';
import theme from './theme';
import colors from './theme/colors';

const App: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <CustomThemeProvider>
                <GlobalContextProvider>
                    <BrowserRouter>
                        <CustomRoute />
                    </BrowserRouter>
                    <WalletModal />
                    <WalletSelectorModal />
                </GlobalContextProvider>
            </CustomThemeProvider>
        </ThemeProvider>
    );
};

export const globals = css`
    :global() {
        :root {
            --onboard-modal-z-index: ${zIndex.walletSelectorModal};
        }

        html, body {
            margin: 0;
            padding: 0;
            min-height: 100vh;
        }

        body {
            height: auto;
            font-family: MOZAIC-GEO, Arial, Kanit, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', 'Noto Sans', sans-serif;
            font-weight: 400;
        }

        ::selection {
            color: ${colors.black};
        }

        p {
            margin: 0;
            padding: 0;
        }

        ul.customized {
            margin: 0;
            padding: 0;
            list-style: none;

            li::before {
                content: "";
                display: inline-block;
                margin-right: 5px;
                background-color: ${colors.primary};
                vertical-align: middle;
                width: 4px;
                height: 4px;
                border-radius: 100%;
            }
        }

        table {
            width: 100%;
            border: 1px solid ${colors.border};
            border-collapse: collapse;
            background-color: ${colors.backgroundSecondary};
        }

        th {
            font-weight: bold;
        }

        th, td {
            padding: 10px 30px;
            text-align: left;
        }

        thead tr,
        tbody tr:not(:last-child) {
            border-bottom: 1px solid ${colors.borderSecondary};
        }

        .ant-modal {
            overflow: auto;
            border-radius: 8px;
            padding-bottom: 0;
            background-color: ${colors.backgroundReverse};
        }

        .ant-modal-header {
            padding: 24px;
            border-bottom: none;
        }

        .ant-modal-title {
            font-size: 18px;
        }

        .ant-modal-close-x {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 20px;
            margin-right: 20px;
            width: 32px;
            height: 32px;
            background-color: #ebeef5;
            border-radius: 100%;

            &:hover {
                background-color: #eee;
            }
        }

        .ant-popover-inner {
            border-radius: 8px;
        }

        .ant-pagination {
            .ant-pagination-item {  
                background-color: ${colors.backgroundSecondary};
                color: ${colors.text};

                a {
                    color: ${colors.text};
                }

                &:hover,
                &-active {
                    border: 1px solid ${colors.primary};
                }
            }

            .ant-pagination-prev,
            .ant-pagination-next {
                .ant-pagination-item-link {
                    background-color: ${colors.backgroundSecondary};
                    color: ${colors.text};
                }

                &:hover {
                    .ant-pagination-item-link {
                        color: ${colors.text};
                        border-color: ${colors.border};
                    }
                }
            }

            .ant-pagination-disabled,
            .ant-pagination-disabled:hover {
                .ant-pagination-item-link {
                    color: ${colors.text};
                    border-color: ${colors.border};
                }
            }

            .ant-pagination-jump-prev,
            .ant-pagination-jump-next {
                .ant-pagination-item-ellipsis,
                .ant-pagination-item-link-icon {
                    color: ${colors.text};
                }

                &:hover {
                    .ant-pagination-item-ellipsis,
                    .ant-pagination-item-link-icon {
                        color: ${colors.text};
                    }
                }
            }
        }

        .ant-pagination-options {
            .ant-select {
                .ant-select-selector {
                    padding-left: 8px !important;
                    background-color: ${colors.backgroundSecondary};
                    color: ${colors.text};

                    font-size: 14px;

                    .ant-select-selection-item {
                        padding-right: 0;
                    }
                }

                &:hover {
                    .ant-select-selector {
                        border-color: ${colors.primary};
                    }
                }
            }

            .ant-select-focused:not(.ant-select-disabled).ant-select:not(.ant-select-customize-input) .ant-select-selector {
                border-color: ${colors.primary};
            }

            .ant-select-dropdown {
                .ant-select-item {
                    padding: 8px;
                }
            }
        }
        

        .ant-select  {
            .ant-select-selector {
                padding-left: 30px !important;
                font-size: 18px;
            }

            .ant-select-arrow {
                right: 30px;
                font-size: 18px;
            }
        }

        .ant-select-dropdown {
            .ant-select-item {
                padding: 8px 30px;
            }

            .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
                background-color: #ccffcc;
            }
        }

        .ant-radio-group-solid .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
            color: ${colors.black};
        }

        .ant-radio-group-solid .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):hover {
            color: ${colors.black};
        }

        .walletconnect-modal__mobile__toggle a {
            color: ${colors.black};
        }

        .ant-pagination {
            .ant-pagination-simple-pager {
                position: relative;
                top: -2px;
                color: #999;
                input {
                    border-radius: 100%;
                    width: 24px;
                    height: 24px;
                    color: ${colors.pink};
                }
            }
            .ant-pagination-item-link {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 20px!important;
                width: 20px!important;
                border-radius: 100%;
                border: 1px solid #C1C1C1 !important;
            }
        }
    }
`;

export default App;
