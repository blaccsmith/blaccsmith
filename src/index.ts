import { Client, Collection } from 'discord.js';
import { CONSTANTS } from './constants';
import { ClientWithCommands } from './types';
import { getAutomations, getCommandFiles, getEventFiles } from './utils/get-sys-files';

export const client: ClientWithCommands = new Client({
    intents: CONSTANTS.BOT_INTENTS,
    partials: CONSTANTS.BOT_PARTIALS,
});

client.commands = new Collection();

// Register slash commands
for (const file of getCommandFiles()) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

// Listen for slash commands
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands?.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: 'There was an error while executing this command!',
            ephemeral: true,
        });
    }
});

// Register events that we'll listen to
for (const file of getEventFiles()) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

// Running all bot automations
for (const file of getAutomations()) {
    const automation = require(`./automations/${file}`);
    automation.run();
}

client.login(CONSTANTS.DISCORD_TOKEN);
