/**
 * Copied from: https://github.com/aptos-labs/aptos-wallet-adapter/blob/main/packages/wallet-adapter-ant-design/src/WalletSelector.tsx
 */

import {ArrowLeftOutlined, ArrowRightOutlined} from '@ant-design/icons';
import {
    AboutAptosConnect,
    AboutAptosConnectEducationScreen,
    AdapterNotDetectedWallet,
    AdapterWallet,
    AptosPrivacyPolicy,
    WalletItem,
    WalletSortingOptions,
    groupAndSortWallets,
    isInstallRequired,
    useWallet
} from '@aptos-labs/wallet-adapter-react';
import {
    Button,
    Divider,
    Modal,
    ModalProps,
    Typography
} from 'antd';
import {Flex} from 'theme-ui';

import {useWalletContext} from 'src/contexts/global-core';

const {Text} = Typography;

export default function WalletSelectorModal(walletSortingOptions: WalletSortingOptions) {
    const {isWalletSelectorOpen, toggleWalletSelector} = useWalletContext();

    const {
        connected,
        wallets = [],
        notDetectedWallets = [],
    } = useWallet();

    const {aptosConnectWallets, availableWallets, installableWallets} =
    groupAndSortWallets(
        [...wallets, ...notDetectedWallets],
        walletSortingOptions
    );

    const hasAptosConnectWallets = !!aptosConnectWallets.length;
    const closeModal = () => toggleWalletSelector?.(false);

    const modalProps: ModalProps = {
        centered: true,
        open: isWalletSelectorOpen,
        onCancel: closeModal,
        footer: null,
        zIndex: 9999,
        className: 'wallet-selector-modal',
    };

    const renderEducationScreens = (screen: AboutAptosConnectEducationScreen) => (
        <Modal
            {...modalProps}
            afterClose={screen.cancel}
            title={
                <div className="about-aptos-connect-header">
                    <Button
                        type="text"
                        icon={<ArrowLeftOutlined />}
                        onClick={screen.cancel}
                    />
                    <div className="wallet-modal-title">About Aptos Connect</div>
                </div>
            }
        >
            <div className="about-aptos-connect-graphic-wrapper">
                <screen.Graphic />
            </div>
            <div className="about-aptos-connect-text-wrapper">
                <screen.Title className="about-aptos-connect-title" />
                <screen.Description className="about-aptos-connect-description" />
            </div>
            <div className="about-aptos-connect-footer-wrapper">
                <Button
                    type="text"
                    style={{justifySelf: 'start'}}
                    onClick={screen.back}
                >
                    Back
                </Button>
                <div className="about-aptos-connect-screen-indicators-wrapper">
                    {screen.screenIndicators.map((ScreenIndicator, i) => (
                        <ScreenIndicator
                            key={i}
                            className="about-aptos-connect-screen-indicator"
                        >
                            <div />
                        </ScreenIndicator>
                    ))}
                </div>
                <Button
                    type="text"
                    icon={<ArrowRightOutlined />}
                    style={{justifySelf: 'end'}}
                    onClick={screen.next}
                >
                    {screen.screenIndex === screen.totalScreens - 1 ? 'Finish' : 'Next'}
                </Button>
            </div>
        </Modal>
    );

    return (
        <AboutAptosConnect renderEducationScreen={renderEducationScreens}>
            <Modal
                {...modalProps}
                title={
                    <div className="wallet-modal-title">
                        {hasAptosConnectWallets ? (
                            <>
                                <span>Log in or sign up</span>
                                <span>with Social + Aptos Connect</span>
                            </>
                        ) : (
                            'Connect Wallet'
                        )}
                    </div>
                }
            >
                {!connected && (
                    <>
                        {hasAptosConnectWallets && (
                            <Flex sx={{flexDirection: 'column', gap: '12px'}}>
                                {aptosConnectWallets.map(wallet => (
                                    <AptosConnectWalletRow
                                        key={wallet.name}
                                        wallet={wallet}
                                        onConnect={closeModal}
                                    />
                                ))}
                                <p className="about-aptos-connect-trigger-wrapper">
                                    Learn more about{' '}
                                    <AboutAptosConnect.Trigger className="about-aptos-connect-trigger">
                                        Aptos Connect
                                        <ArrowRightOutlined />
                                    </AboutAptosConnect.Trigger>
                                </p>
                                <AptosPrivacyPolicy className="aptos-connect-privacy-policy-wrapper">
                                    <p className="aptos-connect-privacy-policy-text">
                                        <AptosPrivacyPolicy.Disclaimer />{' '}
                                        <AptosPrivacyPolicy.Link className="aptos-connect-privacy-policy-link" />
                                        <span>.</span>
                                    </p>
                                    <AptosPrivacyPolicy.PoweredBy className="aptos-connect-powered-by" />
                                </AptosPrivacyPolicy>
                                <Divider>Or</Divider>
                            </Flex>
                        )}

                        <Flex sx={{flexDirection: 'column', gap: '12px'}}>
                            {availableWallets.map(wallet => (
                                <WalletRow
                                    key={wallet.name}
                                    wallet={wallet}
                                    onConnect={closeModal}
                                />
                            ))}
                        </Flex>

                        {!!installableWallets.length && (
                            <Flex sx={{flexDirection: 'column', gap: '12px'}}>
                                {installableWallets.map(wallet => (
                                    <WalletRow
                                        key={wallet.name}
                                        wallet={wallet}
                                        onConnect={closeModal}
                                    />
                                ))}
                            </Flex>
                        )}
                    </>
                )}
            </Modal>
        </AboutAptosConnect>
    );
}

interface WalletRowProps {
  wallet: AdapterWallet | AdapterNotDetectedWallet
  onConnect?: () => void
}

function WalletRow({wallet, onConnect}: WalletRowProps) {
    return (
        <WalletItem
            wallet={wallet}
            onConnect={onConnect}
            asChild
        >
            <div className="wallet-menu-wrapper">
                <div className="wallet-name-wrapper">
                    <WalletItem.Icon className="wallet-selector-icon" />
                    <WalletItem.Name asChild>
                        <Text className="wallet-selector-text">{wallet.name}</Text>
                    </WalletItem.Name>
                </div>
                {isInstallRequired(wallet) ? (
                    <WalletItem.InstallLink className="wallet-connect-install" />
                ) : (
                    <WalletItem.ConnectButton asChild>
                        <Button className="wallet-connect-button">Connect</Button>
                    </WalletItem.ConnectButton>
                )}
            </div>
        </WalletItem>
    );
}

function AptosConnectWalletRow({wallet, onConnect}: WalletRowProps) {
    return (
        <WalletItem
            wallet={wallet}
            onConnect={onConnect}
            asChild
        >
            <WalletItem.ConnectButton asChild>
                <Button
                    size="large"
                    className="aptos-connect-button"
                >
                    <Flex>
                        <WalletItem.Icon className="wallet-selector-icon" />
                        <WalletItem.Name />
                    </Flex>
                </Button>
            </WalletItem.ConnectButton>
        </WalletItem>
    );
}
