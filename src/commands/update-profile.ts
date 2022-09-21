import { SlashCommandBuilder } from '@discordjs/builders';
import { CacheType, CommandInteraction, GuildMember } from 'discord.js';
import { CONSTANTS } from '../constants';
import { getProfile } from '../utils/getProfile';
import { Link, updateProfile } from '../lib/updateProfile';
import { formatSocial, socials } from '../utils';
import logger from '../utils/logger';

export type CommandInteractionOptionValue = string | number | boolean | undefined;

export const data = new SlashCommandBuilder()
    .setName('update-profile')
    .setDescription('Update your profile card')
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

const getUpdatedLinks = (
    oldLinks: Map<string, string | undefined | null>,
    newLinks: { name: string; value: any }[],
): Link[] => {
    const updatedLinks = newLinks.map(link => {
        const name = link.name;
        const value = link.value;

        const data: any = {
            inline: true,
            name: link!.name[0].toUpperCase() + link!.name.slice(1),
        };

        if (value) {
            data['rawUrl'] = formatSocial(name as keyof typeof socials, value as string)[0];
            data['value'] = formatSocial(name as keyof typeof socials, value as string)[1];
            return data;
        }

        return {
            ...data,
            rawUrl: oldLinks.get(name),
            value: oldLinks.get(name)?.split('.com/')[1],
        };
    }, oldLinks);

    return updatedLinks;
};
export async function execute(interaction: CommandInteraction<CacheType>) {
    const member = interaction.member as GuildMember;
    const status = interaction.options.get('status');
    const github = interaction.options.get('github');
    const linkedin = interaction.options.get('linkedin');
    const twitter = interaction.options.get('twitter');
    const intro = interaction.options.getString('intro');

    if (!member.roles.cache.has(CONSTANTS.MEMBER_ROLE_ID)) {
        await interaction.reply({
            content: `You must be a member to update your profile!`,
            ephemeral: true,
        });
        return;
    }

    const userData = await getProfile({ discordId: member.user.id });

    const oldLinks = new Map<string, string | undefined | null>([
        ['github', userData?.github],
        ['linkedin', userData?.linkedin],
        ['twitter', userData?.twitter],
    ]);

    const newLinks: { name: string; value: CommandInteractionOptionValue }[] = [
        {
            name: 'github',
            value: github?.value,
        },
        {
            name: 'linkedin',
            value: linkedin?.value,
        },
        {
            name: 'twitter',
            value: twitter?.value,
        },
    ];

    const updatedIntro = intro ? intro : (userData?.intro as string);
    const updatedStatus = status?.value ?? userData?.status;
    const updatedLinks = getUpdatedLinks(oldLinks, newLinks);

    const updatedValues = {
        id: member.id,
        status: updatedStatus,
        intro: updatedIntro,
        links: updatedLinks,
    };

    await Promise.all([
        member.roles.add(CONSTANTS.MEMBER_ROLE_ID),
        updateProfile(updatedValues),
        interaction.reply({
            content: 'Profile updated! Use /view-profile to view your updated card!',
            ephemeral: true,
        }),
        logger({
            project: 'blacc',
            channel: 'General',
            event: 'Updated Profile',
            description: member.user.tag,
            icon: '🟢',
            notify: true,
        }),
    ]);
}
