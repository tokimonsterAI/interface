import {Bot, Context, NextFunction, type Api} from 'grammy';
import _ from 'underscore';

import {isIPBlocked, unblockIP} from './access-control';
import {getCacheFilePath, loadFileCache} from './file-cache';

const {STAGE} = process.env;

const channels = {
    alert: -4097474750,
    default: -894665872,
    dev: -1001940787352,
    vip: -1001970517006,
    balance: -4078470971,
    notice: -1002477876590,
};

const botToken = process.env.TELE_TOKEN ?? 'FAKE_TOKEN';
const isFakedBotToken = botToken === 'FAKE_TOKEN';
const isBotInstance = !!process.env.TELE_BOT_INSTANCE; // one botToken could only have one instance
export const bot = new Bot(botToken);

type ChannelType = keyof typeof channels;

type Message = {
    channel: ChannelType
    text: string
    count?: number
    disableStageTag?: boolean
    teleBotSendMessageOptions?: TeleBotSendMessageOptions
}

const MessagesBuffer: Record<string, Message[]> = {}; // group -> Messages

type BotFileConfig = {
    mutedSettings?: Array<{
        channels: ChannelType[]
        keywords: string[]
    }>
}
const botFileConfig = (loadFileCache(getCacheFilePath('shared-bot.json')) ?? {}) as BotFileConfig;
const isMuted = (text: string, channel: ChannelType) => !!botFileConfig.mutedSettings
    ?.some(({channels, keywords}) => channels.includes(channel) && keywords.some(keyword => text.includes(keyword)));

const enqueueMessage = (group: string, message: Message) => {
    if (!MessagesBuffer[group]) {
        MessagesBuffer[group] = [];
    }

    const sameMessage = MessagesBuffer[group].find(({channel, text}) => channel === message.channel && text === message.text);
    if (sameMessage) {
        sameMessage.count = (sameMessage.count ?? 1) + (message.count ?? 1);
    } else {
        MessagesBuffer[group].push(message);
    }
};

// Still got 429 errors when messages are more than 10 per seconds, so decrease the limit to 10
// const MAX_TOTAL_MESSAGES_PER_SECOND = 20;
const MAX_TOTAL_MESSAGES_PER_SECOND = 10;
const sendEnqueuedMessages = _.throttle(() => {
    const flushedMessagesBuffer = Object.keys(MessagesBuffer)
        .filter(group => MessagesBuffer[group].length)
        .reduce((buffer, group) => {
            buffer[group] = MessagesBuffer[group].splice(0, MessagesBuffer[group].length);

            return buffer;
        }, {} as Record<string, Message[]>);

    const total = _.reduce(flushedMessagesBuffer, (sum, messages) => sum + messages.length, 0);
    const groupSize = _.size(flushedMessagesBuffer);
    let maxMessagePerGroup = MAX_TOTAL_MESSAGES_PER_SECOND;
    if (total > MAX_TOTAL_MESSAGES_PER_SECOND) {
        maxMessagePerGroup = Math.floor(MAX_TOTAL_MESSAGES_PER_SECOND / groupSize);
    } // else we are able to send all messages

    if (maxMessagePerGroup < 1) {
        // we are not able to send at least one message per group
        _.each(flushedMessagesBuffer, messages => messages.splice(0, messages.length).forEach(message => skipBotMessage(message)));

        sendBotMessage({
            channel: 'dev',
            text: `[tele-bot] ${total} messages in ${groupSize} groups are skipped, please check service log.`,
        });

        return;
    }

    _.each(flushedMessagesBuffer, (messages, group) => {
        const messagesToSend = messages.length > maxMessagePerGroup
            ? messages.splice(0, maxMessagePerGroup - 1) // left 1 for the skip notification
            : messages.splice(0, messages.length);
        messagesToSend.forEach(message => sendBotMessage(message));

        if (messages.length) {
            const messagesToSkip = messages.splice(0, messages.length);
            messagesToSkip.forEach(message => skipBotMessage(message));

            sendBotMessage({
                channel: 'dev',
                text: `[tele-bot] ${messagesToSkip.length} messages in group [${group}] are skipped, please check service log.`
            });
        }
    });
}, 2e3, {leading: false, trailing: true}); // ensure the last message is sent

const skipBotMessage = ({channel, text, count = 1}: Message) => {
    console.log(`[tele-bot] message skipped: (${count}) [${channel}] ${text}`);
};

const sendBotMessage = ({channel, text, count = 1, disableStageTag, teleBotSendMessageOptions}: Message) => {
    if (isFakedBotToken) {
        console.log(`[tele-bot] Token missing, not sending message: (${count}) [${channel}] ${text}`);

        return;
    }

    const tag = disableStageTag ? '' : `[${STAGE}]`;
    const message = count > 1 ? `${text} (x${count})` : text;
    const taggedMessage = `${tag}${message}`;
    if (isMuted(taggedMessage, channel)) {
        console.log(`[tele-bot] message muted: (${count}) [${channel}] ${text}`);

        return;
    }

    bot.api
        .sendMessage(channels[channel], taggedMessage, teleBotSendMessageOptions)
        .catch(err => {
            console.error(`[tele-bot] message failed: (${count}) [${channel}] ${text}`, err);
        });
};

type TeleBotSendMessageOptions = Parameters<Api['sendMessage']>[2];

export type MessageOptions = {
    channel?: keyof typeof channels
    group?: string // messages of each group will be limited per second averagely
    disableStageTag?: boolean

    teleBotSendMessageOptions?: TeleBotSendMessageOptions
}

export function sendMessage(text: string, {
    channel = 'default',
    group = 'ungrouped',
    ...options
}: MessageOptions = {}) {
    enqueueMessage(group, {channel, text, count: 1, ...options});
    sendEnqueuedMessages();
}

export function sendProjectMsg(project: string, text: string, err?: any, options?: MessageOptions): void {
    const {name = 'Unknown', message: errorMsg = ''} = err as any || {name: ''};
    const shortedErrorMsg = errorMsg.length > 100 ? errorMsg.slice(0, 100) + '...' : errorMsg;
    const formattedMsg = `[${project}]${text}${name || shortedErrorMsg ? `: ${name} ${shortedErrorMsg}` : ''}`;
    const finalMsg = formattedMsg.length > 2000 ? formattedMsg.slice(0, 2000) + '...' : formattedMsg; // max 4096 UTF8 characters
    sendMessage(finalMsg, options);
}

const commands = {
    start: 'start',
    ipCheck: 'ip_check',
    ipUnblock: 'ip_unblock'
};

const adminChatGroupIds = [ // add channels here to allow using admin commands in group chat
    channels.dev
];

const adminUserIds = [ // add users here to allow using admin commands in private chat
    6165622680 // pancake
];

const adminMiddleware = (ctx: Context, next: NextFunction) => {
    const isFromAdminChatGroup = ctx.chat?.id && adminChatGroupIds.includes(ctx.chat?.id);
    const isFromAdminUser = ctx.from?.id && adminUserIds.includes(ctx.from?.id);

    if (isFromAdminChatGroup || isFromAdminUser) {
        return next();
    }

    ctx.reply('Sorry, but you are not authorized.');
};

const findUrl = (ctx: Context): string | undefined => {
    const entities = ctx.message?.entities;
    if (!entities) {
        return;
    }

    const urlEntity = entities.find(entity => entity.type === 'url');
    if (!urlEntity) {
        return;
    }

    return ctx.message?.text?.slice(urlEntity.offset, urlEntity.offset + urlEntity.length);
};

export function startBot() {
    if (isFakedBotToken || !isBotInstance) {
        console.log('[tele-bot] Skip starting bot');

        return;
    }

    bot.on('message', (ctx, next) => {
        console.log('[tele-bot] message received', ctx.message); // just logging, do nothing at present
        next();
    });

    bot.command(commands.start, ctx => ctx.reply('Hi there!'));

    bot.command(commands.ipCheck, adminMiddleware, ctx => {
        const payload = findUrl(ctx) ?? ctx.message?.text.slice(commands.ipCheck.length + 1).trim();
        console.log('[IP Check]', payload);

        if (!payload?.length) {
            ctx.reply(`Please enter '/${commands.ipCheck} {ip_address}' to use the command, e.g. /${commands.ipCheck} 192.168.1.1`);

            return;
        }

        const isBlocked = isIPBlocked(payload);
        ctx.reply(`${payload} is ${isBlocked ? 'blocked' : 'clear'}`);
    });

    bot.command(commands.ipUnblock, adminMiddleware, ctx => {
        const payload = findUrl(ctx) ?? ctx.message?.text.slice(commands.ipUnblock.length + 1).trim();
        console.log('[IP Unblock]', payload);

        if (!payload?.length) {
            ctx.reply(`Please enter '/${commands.ipUnblock} {ip_address}' to use the command, e.g. /${commands.ipUnblock} 192.168.1.1`);

            return;
        }

        const isBlocked = isIPBlocked(payload);
        if (!isBlocked) {
            ctx.reply(`${payload} is not blocked, nothing to do`);

            return;
        }

        unblockIP(payload, '[Bot Command]');
        ctx.reply(`${payload} is unblocked`);
    });

    bot.api.setMyCommands([
        {command: commands.start, description: 'Start the bot'},
        {command: commands.ipCheck, description: 'Check whether an IP is blocked'},
        {command: commands.ipUnblock, description: 'Unblock an IP'}
    ]);

    bot.start();
}
