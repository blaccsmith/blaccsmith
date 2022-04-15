import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { CONSTANTS } from './constants';

const { CLIENT_ID, GUILD_ID, DISCORD_TOKEN } = CONSTANTS;

const commands = [
    new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with pong!'),
    new SlashCommandBuilder()
        .setName('server')
        .setDescription('Replies with server info!'),
    new SlashCommandBuilder()
        .setName('user')
        .setDescription('Replies with user info!'),
].map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(DISCORD_TOKEN as string);

rest.put(
    Routes.applicationGuildCommands(CLIENT_ID as string, GUILD_ID as string),
    { body: commands },
)
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);
