import { CommandInteraction, CacheType, GuildMember } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CONSTANTS } from '../constants';
import { addTopic } from '../lib/addTopic';
import logger from '../utils/logger';
import { updateTopic } from '../lib/updateTopic';
import { removeTopic } from '../lib/removeTopic';

export const data = new SlashCommandBuilder()
    .setName('remove-topic')
    .setDescription('Remove a topic for Water Cooler Wednesdays 💦')
    .addNumberOption(option =>
        option.setName('topic-id').setDescription('The topic to remove').setRequired(true),
    );

export async function execute(interaction: CommandInteraction<CacheType>) {
    const topicId = interaction.options.getNumber('topic-id') as number;
    const member = interaction.member as GuildMember;

    if (!member.roles.cache.has(CONSTANTS.MODERATOR_ROLE_ID)) {
        await interaction.reply({
            content: '🚨 You do not have privileges to remove WCW topics',
            ephemeral: true,
        });
        return;
    }

    await Promise.all([
        removeTopic(topicId),
        interaction.reply({
            content: 'Topic has been removed ✅',
            ephemeral: true,
        }),
        logger({
            project: 'blacc',
            channel: 'general',
            event: `Topic ${topicId} has been removed`,
            description: `Called by ${member.user.tag}`,
            icon: '🗑️',
            notify: true,
        }),
    ]);
}
