import { CommandInteraction, CacheType, GuildMember } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CONSTANTS } from '../constants';
import { embedMessage } from '../utils';

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
        option.setName('github').setDescription('What is your GitHub username?'),
    )
    .addStringOption(option =>
        option.setName('linkedin').setDescription('What is your LinkedinIn username?'),
    )
    .addStringOption(option =>
        option.setName('twitter').setDescription('What is your Twitter handle?'),
    );

export async function execute(interaction: CommandInteraction<CacheType>) {
    const channel = interaction.channel;
    const member = interaction.member as GuildMember;
    const status = interaction.options.get('status');
    const github = interaction.options.getString('github');
    const linkedin = interaction.options.getString('linkedin');
    const twitter = interaction.options.getString('twitter');
    const intro = interaction.options.get('intro');

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
                    author: {
                        name: member.displayName,
                        iconURL: member.user.displayAvatarURL(),
                    },
                }),
            ],
        });
        await interaction.reply({ content: 'Welcome to the server!', ephemeral: true });
    }

    interaction.reply({ content: `Thank you for another intro!`, ephemeral: true });
}
