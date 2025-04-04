import {homePath} from 'src/route/constant';

import {ReactComponent as Discord} from './discord.svg';
import {ReactComponent as Gitbook} from './gitbook.svg';
// import {ReactComponent as Medium} from './medium.svg';
// import {ReactComponent as Telegram} from './telegram.svg';
import {ReactComponent as Twitter} from './twitter.svg';

const discordLink = 'https://discord.gg/5xDyEEPNyU';
export const IconLinks: [typeof Discord, string, string, string, string][] = [
    // [Discord, discordLink, 'Discord', '#7289DA', '#3C4C88']
];

export const LockQuoLinks = [
    ['/lock-quo', 'Lock $QUO', 'V1', '#13A507'],
    ['/lock-quo-v2', 'Lock $QUO', 'V2', '#3EA2FF']
];

export const DocLink = 'https://docs.tokimonster.io';


export const Resources = [
    // ['Partners', '#'],
    ['Codebase', 'https://github.com/quollfi/quoll'],
    ['Documentation', DocLink]
];

export const HomepageHow = [
    [Gitbook, DocLink, 'GITBOOK'],
    [Discord, discordLink, 'DISCORD']
] as [typeof Discord, string, string][];

export const ExternalLinks = [['Docs', DocLink]];

export const HomeLink = [homePath, 'Home'];

export const DeprecatedHeaderRouteLinks = [
];

export const HeaderRouteLinks = [
];

export const DeprecatedHeaderClaimRouteLinks: [string, string][] = [
];

export const HeaderDashboardRouteLinks: [string, string][] = [
];

export const HeaderBridgeRouteLinks: [string, string][] = [

];

export const HeaderMoreLinks: [string, string][] = [
    [DocLink, 'Docs'],
    ...IconLinks.map(([, link, text]) => [link, text] as [string, string])
];

export const Documents = [

];

export const Security = [

];
