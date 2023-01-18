import { CommandInteraction, CacheType, TextChannel, GuildMember } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { embedMessage } from '../utils/embed-message';
import logger from '../utils/logger';

export const data = new SlashCommandBuilder()
    .setName('asking-for-a-friend')
    .setDescription('❓ Anonymously ask a question')
    .addChannelOption(option =>
        option
            .setName('channel')
            .setDescription('What channel should we post the question in?')
            .setRequired(true),
    )
    .addStringOption(option =>
        option.setName('question').setDescription(`What's your question?`).setRequired(true),
    );

export async function execute(interaction: CommandInteraction<CacheType>) {
    const member = interaction.member as GuildMember;
    const channelValue = interaction.options.get('channel');
    const question = interaction.options.getString('question');

    if (!(channelValue?.channel instanceof TextChannel)) {
        await interaction.reply({
            content: 'Try again, you must select a valid channel!',
            ephemeral: true,
        });
        return;
    }

    const channel = interaction.client.channels.cache.get(
        channelValue?.channel?.id as string,
    ) as TextChannel;

    await channel.send({
        embeds: [
            embedMessage({
                title: question as string,
                description:
                    'If you want to ask a question anonymously, use the `/asking-for-a-friend` slash command',
                color: '#5bd64b',
                author: {
                    name: 'Asking for a Friend',
                    iconURL: 'https://blacc.vercel.app/blacc.png',
                },
            }),
        ],
    });

    await Promise.all([
        interaction.reply({
            content: `Your question has been sent! Check it out: <#${channel.id}>`,
            ephemeral: true,
        }),
        logger({
            project: 'blacc',
            channel: 'general',
            event: `Someone asked anonymously in #${channel.name}`,
            description: `Called by ${member.user.tag}`,
            icon: '❓',
            notify: true,
        }),
    ]);
}
