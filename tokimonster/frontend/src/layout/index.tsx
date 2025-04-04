import {Outlet, useLocation} from 'react-router-dom';
import {Box, Container} from 'theme-ui';

import ErrorBoundary from '@shared/fe/component/error-boundary';

import bgHaloTop from 'src/assets/bg-halo-top.svg';
import bgHalo from 'src/assets/bg-halo.svg';

import Header from './header';

const Layout: React.FC = () => {
    const location = useLocation();

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'background',
                transition: 'all 0.3s ease',
                backgroundImage: `url(${bgHalo}), url(${bgHaloTop})`,
                backgroundPosition: 'bottom left -120px, top right',
                backgroundSize: ['520px 626px, 0px 0px', '520px 626px, 200px 200px'],
                backgroundRepeat: 'no-repeat, no-repeat'
            }}
        >
            <Header />

            <Container
                sx={{
                    position: 'relative',
                    flex: 1,
                    marginTop: 0, // header height
                    pt: [0, 0, 72]
                }}
            >
                <Box
                    sx={{
                        position: 'relative'
                    }}
                >
                    <ErrorBoundary currentPath={location.pathname}>
                        <Container sx={{p: 0, pt: 5, pb: 11}}>
                            <Outlet />
                        </Container>
                    </ErrorBoundary>
                </Box>
            </Container>
        </Box>
    );
};

export default Layout;
