import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { CONSTANTS } from './constants';
import { getCommandFiles } from './utils/get-sys-files';

const { CLIENT_ID, GUILD_ID, DISCORD_TOKEN } = CONSTANTS;

const commands = [];

for (const file of getCommandFiles()) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(DISCORD_TOKEN as string);

rest.put(Routes.applicationGuildCommands(CLIENT_ID as string, GUILD_ID as string), {
    body: commands,
})
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);
