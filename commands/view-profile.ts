import { CacheType, CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CONSTANTS } from '../constants';
import { getProfile } from '../lib/getProfile';
import { embedMessage } from '../utils/embed-message';

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
        member => member.user.username.toLocaleLowerCase() === username.trim().toLocaleLowerCase(),
    );

    if (!member || !member.roles.cache.has(CONSTANTS.MEMBER_ROLE_ID)) {
        await interaction.reply({ content: `Could not find user ${username}`, ephemeral: true });
        return;
    }
    const userData = await getProfile({ userId: member.user.id });

    const links = [userData?.github, userData?.linkedin, userData?.twitter]
        .filter(Boolean)
        .map(link => ({
            inline: true,
            name: link?.includes('github')
                ? 'Github'
                : link?.includes('linkedin')
                ? 'Linkedin'
                : 'Twitter',
            rawUrl: link,
            value: link as string,
        }));

    embedMessage({
        title: `${member.displayName}'s profile`,
        description: `${member.displayName}'s profile`,
        color: '#5bd64b',
        thumbnail: member.user.displayAvatarURL(),
        links,
    });
    await interaction.reply({ content: `Found user ${member.displayName}!`, ephemeral: true });
}
