const cron = require('node-cron');
import { Client, Collection, TextChannel } from 'discord.js';
import { CONSTANTS } from './constants';
import { ClientWithCommands } from './types';
import { getCommandFiles, getEventFiles } from './utils/get-sys-files';
import { scheduledEvent } from './utils/scheduled-event';
import { runScheduledEvents } from './utils';

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

const format = (x: number) => (x.toString().length < 2 ? `0${x}` : x);

const goodNewsFriday = () => {
    // Good news Friday Event
    scheduledEvent({
        scheduling: '0 0 * * FRI',
        scheduledStartTime: new Date(Date.now() + 1000 * 3600 * 8),
        scheduledEndTime: new Date(Date.now() + 1000 * 3600 * 16),
        name: 'Good News Friday 🥳',
        description:
            "It's Good News Friday and we want to celebrate your wins this week! Come share your accomplishments with us!",
        channel: CONSTANTS.GENERAL_CHANNEL_ID,
        entityType: 'EXTERNAL',
        entityMetadata: { location: '#general channel' },
    });

    cron.schedule('0 8 * * FRI', async () => {
        const guild = client.guilds.cache.get(CONSTANTS.GUILD_ID);
        const channel = guild?.channels.cache.get(CONSTANTS.GENERAL_CHANNEL_ID) as TextChannel;
        const dateObj = new Date();
        const formattedDate = `${dateObj.getUTCFullYear()}-${format(
            dateObj.getUTCMonth() + 1,
        )}-${format(dateObj.getUTCDate())}`;

        const createdMessage = await channel.send({
            content: `It's Good News Friday and we want to celebrate your wins this week <@&${CONSTANTS.MEMBER_ROLE_ID}> 🥳 Comment in this thread with your small wins, something exciting that happened, etc. this week! Can be related to your job, a side project, or life in general - we wanna know about it and celebrate you!`,
        });

        await createdMessage.startThread({
            name: `GNF 🎊 ${formattedDate}`,
            reason: 'Bringing good Friday vibes',
        });
    });
};

runScheduledEvents([goodNewsFriday]);
