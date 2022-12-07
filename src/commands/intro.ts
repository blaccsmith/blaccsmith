import { CommandInteraction, CacheType, GuildMember, TextChannel } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CONSTANTS } from '../constants';
import { formatSocial, socials } from '../utils';
import { embedMessage } from '../utils/embed-message';
import { updateProfile } from '../lib/updateProfile';
import { deleteOnBoardingMessage } from '../lib/deleteMessage';
import logger from '../utils/logger';
import { addMemberStatusRole } from '../lib/addMemberStatusRole';

export const data = new SlashCommandBuilder()
    .setName('intro')
    .setDescription('✨ Tell us a bit about yourself!')
    .addStringOption(option =>
        option.setName('intro').setDescription('Write your intro here').setRequired(true),
    )
    .addStringOption(option =>
        option
            .setName('status')
            .setDescription(`How would you describe yourself?`)
            .setRequired(true)
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
            .setDescription('What is your LinkedIn username? Ex: linkedin.com/in/{username}'),
    )
    .addStringOption(option =>
        option
            .setName('twitter')
            .setDescription('What is your Twitter handle? Ex: twitter.com/{username}'),
    );

export async function execute(interaction: CommandInteraction<CacheType>) {
    const channel = interaction.channel;
    const welcomeChannel = interaction.client.channels.cache.get(
        CONSTANTS.WELCOME_CHANNEL_ID,
    ) as TextChannel;
    const member = interaction.member as GuildMember;
    const status = interaction.options.get('status');
    const github = interaction.options.get('github');
    const linkedin = interaction.options.get('linkedin');
    const twitter = interaction.options.get('twitter');
    const intro = interaction.options.getString('intro');

    const links = [github, linkedin, twitter].filter(Boolean).map(link => {
        const socialLinks = formatSocial(link!.name as keyof typeof socials, link!.value as string);

        return {
            inline: true,
            name: link!.name[0].toUpperCase() + link!.name.slice(1),
            rawUrl: socialLinks[0],
            value: socialLinks[1],
        };
    });

    if (
        channel?.id !== CONSTANTS.ONBOARDING_CHANNEL_ID ||
        !member.roles.cache.has(CONSTANTS.ONBOARDING_ROLE_ID)
    ) {
        await interaction.reply({
            content: `You can only use this command in the onboarding channel.`,
            ephemeral: true,
        });
        return;
    }

    await Promise.all([
        member.roles.remove(CONSTANTS.ONBOARDING_ROLE_ID),
        member.roles.add(CONSTANTS.MEMBER_ROLE_ID),
        addMemberStatusRole(member, status!),
        updateProfile({ id: member.user.tag, status, links, intro }),
        interaction.reply('Thank you for introducing yourself! Go check out the other channels!'),
        deleteOnBoardingMessage(interaction, member),
        welcomeChannel?.send({
            embeds: [
                embedMessage({
                    title: `Welcome ${member.displayName}!`,
                    description: `${intro}`,
                    color: '#5bd64b',
                    thumbnail: member.user.displayAvatarURL(),
                    links,
                    status: status?.value as string,
                }),
            ],
        }),
        logger({
            project: 'blacc',
            channel: 'welcome',
            event: 'New introduction',
            description: member.user.tag,
            icon: '👋',
            notify: true,
        }),
    ]);
}
