import { CommandInteraction, CacheType, GuildMember } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CONSTANTS } from '../constants';
import { formatSocial, socials } from '../utils';
import { embedMessage } from '../utils/embed-message';

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
            .setDescription('What is your LinkedinIn username? Ex: linkedin.com/in/{username}'),
    )
    .addStringOption(option =>
        option
            .setName('twitter')
            .setDescription('What is your Twitter handle? Ex: twitter.com/{username}'),
    );

export async function execute(interaction: CommandInteraction<CacheType>) {
    const channel = interaction.channel;
    const member = interaction.member as GuildMember;
    const status = interaction.options.get('status');
    const github = interaction.options.get('github');
    const linkedin = interaction.options.get('linkedin');
    const twitter = interaction.options.get('twitter');
    const intro = interaction.options.getString('intro');

    const links = [github, linkedin, twitter].filter(Boolean).map(link => ({
        name: link!.name[0].toUpperCase() + link!.name.slice(1),
        value: formatSocial(link!.name as keyof typeof socials, link!.value as string),
        inline: true,
    }));

    if (channel?.id !== CONSTANTS.WELCOME_CHANNEL_ID) {
        await interaction.reply({
            content: `You can only use this command in the welcome channel.`,
            ephemeral: true,
        });
        return;
    }

    if (!member.roles.cache.has(CONSTANTS.MEMBER_ROLE_ID)) {
        await member.roles.add(CONSTANTS.MEMBER_ROLE_ID);
        await channel.send({
            embeds: [
                embedMessage({
                    title: `Welcome ${member.displayName}!`,
                    description: `${intro}`,
                    color: '#5bd64b',
                    thumbnail: member.user.displayAvatarURL(),
                    links,
                }),
            ],
        });
        await interaction.reply({ content: 'Welcome to the server!', ephemeral: true });
        return;
    }

    await interaction.reply({ content: `Thank you for another intro!`, ephemeral: true });
}
