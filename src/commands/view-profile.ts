import { CacheType, CommandInteraction, GuildMember } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CONSTANTS } from '../constants';
import { getProfile } from '../utils/getProfile';
import { embedMessage } from '../utils/embed-message';
import { formatSocial, getLinkName, socials, messageReply } from '../utils';

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

    if (!searchedMember) {
        await interaction.reply({ content: `Could not find user ${username}`, ephemeral: true });
        return;
    }

    // Not a member
    if (!searchedMember.roles.cache.has(CONSTANTS.MEMBER_ROLE_ID)) {
        const message =
            'Someone has tried viewing your profile but profiles creations are only available to members. To become a member reply with a ✅ to the community guidelines and introduce yourself in the #welcome channel.';
        await messageReply(interaction, message, searchedMember);
        return;
    }

    const profileData = await getProfile({ discordId: searchedMember.user.id });

    if (!profileData) {
        const message =
            "Someone has tried viewing your profile but you haven't created one yet. Please use the '/update-profile command to create your profile.";
        await messageReply(interaction, message, searchedMember);
        return;
    }

    const rawLinks = [profileData?.github, profileData?.linkedin, profileData?.twitter]
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

    await interaction.reply({
        content: `${searchedMember.displayName}'s profile!`,
        embeds: [
            embedMessage({
                title: `${searchedMember.displayName}'s profile`,
                description: `${profileData?.intro}`,
                color: '#5bd64b',
                thumbnail: searchedMember.user.displayAvatarURL(),
                links,
            }),
        ],
        ephemeral: true,
    });
}
