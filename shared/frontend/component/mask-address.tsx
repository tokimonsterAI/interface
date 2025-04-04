import {useResponsiveValue} from '@theme-ui/match-media';

import {isMobile} from '@shared/fe/util/ua';

import Copy from './copy';

export const defaultSettings = [[4, 2, 4], [6, 4, 4]];

function MaskAddress({
    address,
    responsiveSettings = defaultSettings,
    enableCopy
}: {
    address: any
    responsiveSettings?: typeof defaultSettings
    enableCopy?: boolean
}) {
    const setting = useResponsiveValue(responsiveSettings, {defaultIndex: isMobile ? 0 : 1});
    if (!setting) {
        return <>{address}</>;
    }

    if (!address) {
        return address;
    }

    const [preLen, dotCount, tailLen] = setting;
    if (address.length <= preLen + tailLen + dotCount / 2) {
        return <>{address}</>;
    }

    return (
        <>
            {address?.slice(0, preLen) + '.'.repeat(dotCount) + address?.slice(-tailLen)}
            {enableCopy && <Copy text={address} />}
        </>
    );
}

MaskAddress.defaultSettings = defaultSettings;

export default MaskAddress;
