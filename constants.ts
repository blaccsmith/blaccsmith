import { Method } from 'axios';
import { Intents, PartialTypes } from 'discord.js';
import { config } from 'dotenv';
config();

export const CONSTANTS = Object.freeze({
    DISCORD_TOKEN: process.env.DISCORD_TOKEN as string,
    CLIENT_ID: process.env.CLIENT_ID as string,
    GUILD_ID: process.env.GUILD_ID as string,
    WELCOME_CHANNEL_ID: process.env.WELCOME_CHANNEL_ID as string,
    COMMUNITY_GUIDELINES_CHANNEL_ID: process.env.COMMUNITY_GUIDELINES_CHANNEL_ID as string,
    COMMUNITY_GUIDELINES_MESSAGE_ID: process.env.COMMUNITY_GUIDELINES_MESSAGE_ID as string,
    BOT_INTENTS: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ],
    BOT_PARTIALS: ['MESSAGE', 'CHANNEL', 'REACTION'] as PartialTypes[],
    SPECTATOR_ROLE_ID: process.env.SPECTATOR_ROLE_ID as string,
    MEMBER_ROLE_ID: process.env.MEMBER_ROLE_ID as string,
    _5_SECONDS: 5000,
    _1_HOUR: 3600000,
    _6_HOURS: 21600000,
    _1_DAY: 86400000,
    LOG_OPTIONS: {
        method: 'POST' as Method,
        url: process.env.LOG_URL as string,
        headers: { Authorization: `Bearer ${process.env.LOG_TOKEN as string}` },
    },
});
