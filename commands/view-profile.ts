import { CacheType, CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CONSTANTS } from '../constants';

export const data = new SlashCommandBuilder()
    .setName('view-profile')
    .setDescription('Find a user by their username')
    .addStringOption(option =>
        option
            .setName('username')
            .setDescription('The username of the user to find')
            .setRequired(true),
    );

export async function execute(interaction: CommandInteraction<CacheType>) {
    const guild = await interaction.client.guilds.fetch(CONSTANTS.GUILD_ID);
    const username = interaction.options.getString('username') as string;
    const member = guild.members.cache.find(
        member => member.user.username.toLocaleLowerCase() === username.toLocaleLowerCase(),
    );

    if (!member || !member.roles.cache.has(CONSTANTS.MEMBER_ROLE_ID)) {
        await interaction.reply({ content: `Could not find user ${username}`, ephemeral: true });
        return;
    }

    await interaction.reply({ content: `Found user ${member}!`, ephemeral: true });
}
