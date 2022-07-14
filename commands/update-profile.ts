import { SlashCommandBuilder } from '@discordjs/builders';
import { CacheType, CommandInteraction, GuildMember } from 'discord.js';
import { CONSTANTS } from '../constants';
import { getProfile } from '../lib/getProfile';
import { updateProfile } from '../lib/updateProfile';
import { formatSocial, socials } from '../utils';
import { embedMessage } from '../utils/embed-message';
import logger from '../utils/logger';

export const data = new SlashCommandBuilder()
    .setName('update-profile')
    .setDescription("Update a user's profile")
    .addStringOption(option => option.setName('intro').setDescription('Write your intro here'))
    .addStringOption(option =>
        option
            .setName('status')
            .setDescription(`How would you describe yourself?`)
            .addChoices([
                ['🌱 Aspiring Developer', 'Aspiring'],
                ['🪴 Junior Developer', 'Junior'],
                ['🌿 Mid-level Developer', 'Mid-level'],
                ['🌳 Senior Developer', 'Senior'],
                ['Other', 'Other'],
            ]),
    )
    .addStringOption(option =>
        option
            .setName('github')
            .setDescription('What is your GitHub username? Ex: github.com/{username}'),
    )
    .addStringOption(option =>
        option
            .setName('linkedin')
            .setDescription('What is your LinkedinIn username? Ex: linkedin.com/in/{username}'),
    )
    .addStringOption(option =>
        option
            .setName('twitter')
            .setDescription('What is your Twitter handle? Ex: twitter.com/{username}'),
    );

export async function execute(interaction: CommandInteraction<CacheType>) {
    const member = interaction.member as GuildMember;
    const status = interaction.options.get('status');
    const github = interaction.options.get('github');
    const linkedin = interaction.options.get('linkedin');
    const twitter = interaction.options.get('twitter');
    const intro = interaction.options.getString('intro');

    if (!member.roles.cache.has(CONSTANTS.MEMBER_ROLE_ID)) {
        await interaction.reply({ content: `You must be a member to update your profile!` });
        return;
    }

    const userData = await getProfile({ discordId: member.user.id });

    const oldUserLinks = {
        github: userData?.github,
        linkedin: userData?.linkedin,
        twitter: userData?.twitter,
    };

    const links = [github, linkedin, twitter].map(link => ({
        inline: true,
        name: link!.name[0].toUpperCase() + link!.name.slice(1),
        rawUrl:
            formatSocial(link!.name as keyof typeof socials, link!.value as string)[0] ??
            oldUserLinks[link?.name as keyof typeof oldUserLinks],
        value:
            formatSocial(link!.name as keyof typeof socials, link!.value as string)[1] ??
            oldUserLinks[link?.name as keyof typeof oldUserLinks]?.split('.com/')[1],
    }));

    const updatedValues = {
        id: member.id,
        status: status ?? (userData?.status as string),
        intro: intro ?? (userData?.intro as string),
        links,
    };

    await Promise.all([
        member.roles.add(CONSTANTS.MEMBER_ROLE_ID),
        updateProfile(updatedValues),
        interaction.reply({
            content: 'Profile updated! Use /view-profile to view your updated card!',
            ephemeral: true,
        }),
    ]);

    await logger({
        project: 'blacc',
        channel: 'welcome',
        event: 'New introduction',
        description: member.user.tag,
        icon: '🟢',
        notify: true,
    });

    await updateProfile({ id: member.id, status, links, intro });
    await interaction.reply({ content: `Thank you for another intro!`, ephemeral: true });
}
