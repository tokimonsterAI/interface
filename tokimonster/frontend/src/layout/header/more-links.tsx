import {Dropdown, Menu} from 'antd';
import {NavLink} from 'react-router-dom';
import {Link} from 'theme-ui';

import Cond from '@shared/fe/component/cond';

type Props = {
    links: [string, string][]
}

const MoreLinks: React.FCD<Props> = ({links, children}) => {
    return (
        <Dropdown
            overlay={(
                <Menu sx={{variant: 'layout.headerMenu'}} >
                    {links.map(([href, name], idx) => (
                        <Menu.Item
                            key={idx}
                            sx={theme => theme.layout?.headerMenuItem as any}
                        >
                            <Cond
                                cond={/^http/i.test(href)}
                                fragment
                            >
                                <Link
                                    variant="reset"
                                    href={href}
                                    target="_blank"
                                >
                                    {name}
                                </Link>

                                <NavLink to={href}>
                                    {name}
                                </NavLink>
                            </Cond>
                        </Menu.Item>
                    ))}
                </Menu>
            )}
        >
            {children}
        </Dropdown>
    );
};

export default MoreLinks;
