import { CommandInteraction, CacheType, TextChannel, MessageEmbed } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

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

    await channel.send({ embeds: [embedMessage(question as string)] });
    interaction.reply({
        content: `Your question has been sent! Check it out: <#${channel.id}>`,
        ephemeral: true,
    });
    console.log(`❓ Someone asked anonymously in #${channel.name}`);
}

const embedMessage = (question: string) => {
    const description =
        'If you want to ask a question anonymously, use the `/asking-for-a-friend` slash command';

    return new MessageEmbed()
        .setColor('#5bd64b')
        .setTitle(question)
        .setAuthor({ name: 'Asking for a Friend', iconURL: 'https://blacc.vercel.app/blacc.png' })
        .setDescription(description)
        .setTimestamp();
};
