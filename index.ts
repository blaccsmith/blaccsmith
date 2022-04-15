import { Client, Intents } from 'discord.js';
import { config } from 'dotenv';
config();

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', () => {
    console.log('Ready player one!');
});

client.login(process.env.DISCORD_TOKEN);
