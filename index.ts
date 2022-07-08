import { Client, Collection, GuildScheduledEventCreateOptions } from 'discord.js';
import { CONSTANTS } from './constants';
import { ClientWithCommands } from './types';
import { getCommandFiles, getEventFiles } from './utils/get-sys-files';

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

client.login(CONSTANTS.DISCORD_TOKEN);

const cron = require('node-cron');

cron.schedule(
    '* 0 9 * * FRI',
    () => {
        const generalId = '988246104892145704';
        const options: GuildScheduledEventCreateOptions = {
            name: 'Good News Friday',
            channel: generalId,
            privacyLevel: 'GUILD_ONLY',
            description: 'Share your good news!',
            entityType: 'EXTERNAL',
            scheduledStartTime: new Date(Date.now() + 3600 * 1000 * 24),
            scheduledEndTime: new Date(Date.now() + 3600 * 1000 * 24 * 2),
            entityMetadata: {
                location: '#general channel',
            },
        };

        const guild = client.guilds.cache.get(CONSTANTS.GUILD_ID);

        if (!guild) return;

        guild.scheduledEvents.create(options);
    },
    {
        scheduled: true,
        timezone: 'America/Chicago',
    },
);
