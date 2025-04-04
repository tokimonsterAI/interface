import {CSSProperties} from 'react';

import change, {ReactComponent as ChangeSvg} from 'src/assets/icon/icon-change.svg';
import close, {ReactComponent as CloseSvg} from 'src/assets/icon/icon-close.svg';
import info, {ReactComponent as InfoSvg} from 'src/assets/icon/icon-info.svg';
import link, {ReactComponent as LinkSvg} from 'src/assets/icon/icon-link.svg';
import logout, {ReactComponent as LogoutSvg} from 'src/assets/icon/icon-logout.svg';

const imageUrls = {
    change,
    close,
    info,
    link,
    logout,
};

type IconProps = {
    type: 'change' | 'close' | 'info' | 'link' | 'logout'
    width?: string | number
    height?: string | number
    style?: CSSProperties
}

const Icon: React.FC<IconProps> = ({type, width, height, ...rest}) => (
    <img
        src={imageUrls[type]}
        width={width}
        height={height}
        {...rest}
    />
);

const SvgMap = {
    change: ChangeSvg,
    close: CloseSvg,
    info: InfoSvg,
    link: LinkSvg,
    logout: LogoutSvg,
};

type SvgIconProps = {
    className?: string
    type: IconProps['type']
}

export const SvgIcon: React.FC<SvgIconProps> & Omit<React.FCSVG, 'type'> = ({type, className, ...props}) => {
    const SvgComp = SvgMap[type];

    return (
        <SvgComp
            className={className}
            {...props}
        />
    );
};

export default Icon;
