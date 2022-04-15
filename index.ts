import { Client, Guild, Intents } from 'discord.js';
import { CONSTANTS } from './constants';

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', () => {
    console.log('Ready player one!');
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'ping') {
        await interaction.reply('Pong!');
    } else if (commandName === 'server') {
        const guild = interaction.guild as Guild;
        const message = `Server name: ${guild.name}\nTotal members: ${guild.memberCount}`;

        await interaction.reply(message);
    } else if (commandName === 'user') {
        const message = `Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`;
        await interaction.reply(message);
    }
});

client.login(CONSTANTS.DISCORD_TOKEN);
