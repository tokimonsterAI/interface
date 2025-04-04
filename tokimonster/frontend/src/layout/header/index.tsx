// import {BulbOutlined, BulbFilled} from '@ant-design/icons';
// import {Switch} from 'antd';
import {NavLink} from 'react-router-dom';
import {Box, Container, Flex, Text, Heading, Image} from 'theme-ui';

import NetworkButton from 'src/components/network/NetworkButton';
import WalletButton from 'src/components/wallet/WalletButton';
import {useTheme} from 'src/contexts/ThemeContext';
import {homePath} from 'src/route/constant';

import Logo from './assets/logo.svg';

const Header: React.VFC = () => {
    const {isDarkMode} = useTheme();

    return (
        <Box
            variant="layout.header"
            sx={{background: isDarkMode ? '#282828' : 'white'}}
        >
            <Container>
                <Flex
                    sx={{
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '15px 0'
                    }}
                >
                    <Flex>
                        <Image
                            src={Logo}
                            sx={{height: 42}}
                        ></Image>
                        <Heading
                            as="h1"
                            sx={{ml: 2, fontSize: 24}}
                        >
                            <NavLink
                                to={homePath}
                                sx={{color: 'text'}}
                            >
                                <Text sx={{color: 'secondary'}}>Toki</Text>monster
                            </NavLink>
                        </Heading>
                    </Flex>

                    <Flex sx={{
                        marginLeft: '15px',
                        gap: [0, 0, '24px', '32px'],
                        alignItems: 'center',
                        lineHeight: 1,
                        fontSize: 2
                    }}
                    >
                        <Flex sx={{gap: 1}}>
                            {/* <Box sx={{display: 'flex', alignItems: 'center', mr: [1, 3]}}>
                                <Switch
                                    checked={isDarkMode}
                                    onChange={toggleMode}
                                    checkedChildren={<BulbOutlined />}
                                    unCheckedChildren={<BulbFilled />}
                                />
                            </Box> */}
                            <NetworkButton />
                            <WalletButton />
                        </Flex>
                    </Flex>
                </Flex>
            </Container>
        </Box>
    );
};

export default Header;
