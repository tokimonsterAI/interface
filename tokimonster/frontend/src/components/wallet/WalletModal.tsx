import {truncateAddress, useWallet} from '@aptos-labs/wallet-adapter-react';
import {styled} from '@linaria/react';
import {Button, Text, Image} from 'theme-ui';

import Copy from '@shared/fe/component/copy';

import {SvgIcon} from 'src/components/basic-ui/icon';
import Modal from 'src/components/basic-ui/modal';
import {zIndex} from 'src/constants';
import {useWalletContext} from 'src/contexts/GlobalContext';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 16px;
    width: 100%;
    font-size: 14px;
    font-weight: 500;
`;

const WalletLogo = styled.div`
    margin-bottom: 12px;
`;

const WalletName = styled.div`
    margin-bottom: 10px;
    font-size: 18px;
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 40px;
    width: 100%;

    button {
        flex: 1;
    }
`;

const ButtonContent = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;

    svg:first-child {
        margin-right: 8px;
    }
`;

const WalletModal: React.FC = () => {
    const {
        wallet,
        account,
        disconnect
    } = useWallet();

    const {
        isWalletOpen,
        toggleWallet,
        toggleWalletSelector
    } = useWalletContext();

    return (
        <Modal
            zIndex={zIndex.walletModal} // default is 1000
            open={isWalletOpen}
            onCancel={() => toggleWallet?.(false)}
        >
            <Container>
                {wallet?.icon &&
                <WalletLogo>
                    <Image
                        src={wallet.icon}
                        sx={{height: '80px', width: 'auto'}}
                    />
                </WalletLogo>
                }

                <WalletName>{wallet?.name}</WalletName>

                <Text sx={{wordBreak: 'break-all'}}>
                    {account?.ansName || truncateAddress(account?.address?.toString())}
                    {account?.address &&
                    <Copy text={account?.address?.toString()} />
                    }
                </Text>

                <ButtonGroup sx={{flexDirection: ['column', 'row']}}>
                    <Button
                        variant="modal-secondary"
                        sx={{
                            marginBottom: ['12px', 0],
                            marginX: [0, '12px'],
                            paddingY: ['12px', 0],
                            bg: '#67e714'
                        }}
                        onClick={() => {
                            disconnect?.();
                            toggleWallet?.(false);
                            toggleWalletSelector?.(true);
                        }}
                    >
                        <ButtonContent>
                            <SvgIcon type="change"/>
                            <Text>Change wallet</Text>
                        </ButtonContent>
                    </Button>

                    <Button
                        variant="modal-primary"
                        sx={{
                            marginX: [0, '12px'],
                            paddingY: ['12px', 0]
                        }}
                        onClick={() => {
                            disconnect?.();
                            toggleWallet?.(false);
                        }}
                    >
                        <ButtonContent>
                            <SvgIcon type="logout"/>
                            <Text>Disconnect</Text>
                        </ButtonContent>
                    </Button>
                </ButtonGroup>
            </Container>
        </Modal>
    );
};

export default WalletModal;
