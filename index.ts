import { Client, Collection, Intents } from 'discord.js';
import { CONSTANTS } from './constants';
import { CommandType } from './types';
import { getCommandFiles } from './utils';

type ClientWithCommands = Client & { commands?: Collection<string, any> };

const client: ClientWithCommands = new Client({
    intents: [Intents.FLAGS.GUILDS],
});

client.commands = new Collection();

for (const file of getCommandFiles()) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

client.once('ready', () => {
    console.log('🤖 Ready!');
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command: CommandType = (client.commands as Collection<string, any>).get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.login(CONSTANTS.DISCORD_TOKEN);
