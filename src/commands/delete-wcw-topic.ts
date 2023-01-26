import { CommandInteraction, CacheType, GuildMember } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CONSTANTS } from '../constants';
import { getTopic } from '../lib/getTopic';
import logger from '../utils/logger';
import { deleteTopic } from '../lib/deleteTopic';
import { notifyUser } from '../lib/notifyUser';

export const data = new SlashCommandBuilder()
    .setName('delete-wcw-topic')
    .setDescription('Delete a topic for Water Cooler Wednesdays 💦')
    .addNumberOption(option =>
        option
            .setName('topic-id')
            .setDescription('ID of the topic to be deleted')
            .setRequired(true),
    )
    .addStringOption(option =>
        option.setName('reason').setDescription('Reason for deletion').setRequired(true),
    );

export async function execute(interaction: CommandInteraction<CacheType>) {
    const topicId = interaction.options.getNumber('topic-id') as number;
    const reason = interaction.options.getString('reason') as string;
    const member = interaction.member as GuildMember;

    if (!member.roles.cache.has(CONSTANTS.MODERATOR_ROLE_ID)) {
        await interaction.reply({
            content: '🚨 You do not have permission to delete this topic',
            ephemeral: true,
        });

        return;
    }

    const topicRecord = await getTopic(topicId);

    if (!topicRecord) {
        await interaction.reply({
            content: '🚨 Topic not found',
            ephemeral: true,
        });

        return;
    }

    const author = interaction.client.users.cache.find(user => user.id === topicRecord.authorId);

    await Promise.all([
        deleteTopic(topicId),
        interaction.reply({
            content: 'Topic has been deleted ✅',
            ephemeral: true,
        }),
        notifyUser(
            member.id,
            author,
            `Your WCW topic in the ${interaction.guild?.name} server was deleted by an administrator for the following reason: "${reason}"`,
        ),
        logger({
            project: 'blacc',
            channel: 'general',
            event: `Topic ${topicId} has been deleted`,
            description: `Called by ${member.user.tag}`,
            icon: '🟢',
            notify: true,
        }),
    ]);
}
