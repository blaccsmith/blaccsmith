import { Client, Collection, Intents } from 'discord.js';
import { CONSTANTS } from './constants';
import { ClientWithCommands, CommandType } from './types';
import { getCommandFiles, getEventFiles } from './utils';

const client: ClientWithCommands = new Client({
    intents: [Intents.FLAGS.GUILDS],
});

client.commands = new Collection();

for (const file of getCommandFiles()) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

for (const file of getEventFiles()) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.login(CONSTANTS.DISCORD_TOKEN);
