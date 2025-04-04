export const prelaunchCampaignLaunchTime = 'May 1, 2023 14:00:00 UTC+0';
export const isPrelaunchCampaignLaunched = () => {
    const launchTime = new Date(prelaunchCampaignLaunchTime).getTime();
    const now = new Date().getTime();

    return launchTime <= now;
};

export const UnknownRewardSymbol = 'Others';

export const zIndex = {
    watchAssetModal: 41,
    transactionModal: 40,

    networkSelectorModal: 30,

    walletSelectorModal: 21,
    walletModal: 20,

    modal: 15,

    mobileHeader: 1001, // must > ant-drawer z-index

    header: 10,
    popover: 5
};

export const ClaimBotSheetId = '1IOcfQNChkHWe8owawFSNCpVppFL751Sv8tTDdkxAfXs';
