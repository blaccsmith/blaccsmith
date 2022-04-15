import { config } from 'dotenv';
config();

export const CONSTANTS = Object.freeze({
    DISCORD_TOKEN: process.env.DISCORD_TOKEN as string,
    CLIENT_ID: process.env.CLIENT_ID as string,
    GUILD_ID: process.env.GUILD_ID as string,
});
