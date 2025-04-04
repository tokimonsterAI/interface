import {useRoutes, Navigate} from 'react-router-dom';

import useRouteScroll from '@shared/fe/hook/use-route-scroll';

import Layout from 'src/layout';
import HomePage from 'src/pages/home';
import TokenPage from 'src/pages/token';

import {homePath, tokenPath} from './constant';

export const routes = [
    {
        element: ( // other routes redirect to home
            <Navigate
                to={homePath}
                replace
            />
        ),
        path: '*'
    },
    {
        element: <Layout />,
        children: [
            {
                path: homePath,
                element: <HomePage />,
                meta: {
                    title: 'Tokimonster'
                }
            },

            {
                path: tokenPath,
                element: <TokenPage />,
                meta: {
                    title: 'Token Details'
                }
            }
        ],
    }
];

const CustomRoute: React.FC = () => {
    useRouteScroll({scrollParam: true});

    return useRoutes(routes);
};

export default CustomRoute;
