import { Intents } from 'discord.js';
import { config } from 'dotenv';
config();

export const CONSTANTS = Object.freeze({
    DISCORD_TOKEN: process.env.DISCORD_TOKEN as string,
    CLIENT_ID: process.env.CLIENT_ID as string,
    GUILD_ID: process.env.GUILD_ID as string,
    BOT_INTENTS: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES],
});
