import { CacheType, CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CONSTANTS } from '../constants';
import { getProfile } from '../lib/getProfile';
import { embedMessage } from '../utils/embed-message';
import { formatSocial, socials } from '../utils';

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
    const username = interaction.options.getString('username') as string;
    const guild = await interaction.client.guilds.fetch(CONSTANTS.GUILD_ID);
    const allMembers = await guild.members.fetch();
    const searchedMember = allMembers.find(
        member => member.user.username.toLocaleLowerCase() === username.trim().toLocaleLowerCase(),
    );

    // Can't find user
    if (!searchedMember) {
        await interaction.reply({ content: `Could not find user ${username}`, ephemeral: true });
        return;
    }

    // Profile is not created
    if (!searchedMember.roles.cache.has(CONSTANTS.MEMBER_ROLE_ID)) {
        await interaction.reply({
            content: `${username} does not have their profile configured`,
            ephemeral: true,
        });
        return;
    }

    const userData = await getProfile({ discordId: searchedMember.user.id });

    const rawLinks = [userData?.github, userData?.linkedin, userData?.twitter]
        .filter(Boolean)
        .map(link => ({
            name:
                getLinkName(link as string)
                    .charAt(0)
                    .toUpperCase() + getLinkName(link as string).slice(1),
            rawUrl: formatSocial(
                getLinkName(link as string) as keyof typeof socials,
                link?.split('.com/').pop() as string,
            )[0],
            value: formatSocial(
                getLinkName(link as string) as keyof typeof socials,
                link?.split('.com/').pop() as string,
            )[1],
        }));

    const links = rawLinks.map(link => ({
        inline: true,
        name: link.name,
        rawUrl: link.rawUrl,
        value: link.value,
    }));

    const message = embedMessage({
        title: `${searchedMember.displayName}'s profile`,
        description: `${userData?.intro}`,
        color: '#5bd64b',
        thumbnail: searchedMember.user.displayAvatarURL(),
        links,
    });

    await interaction.reply({
        content: `${searchedMember.displayName}'s profile!`,
        embeds: [message],
        ephemeral: true,
    });
}

const getLinkName = (link: string) =>
    link?.includes('github') ? 'github' : link?.includes('linkedin') ? 'linkedin' : 'twitter';
