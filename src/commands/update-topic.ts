import { CommandInteraction, CacheType, GuildMember } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CONSTANTS } from '../constants';
import { addTopic } from '../lib/addTopic';
import logger from '../utils/logger';
import { updateTopic } from '../lib/updateTopic';

export const data = new SlashCommandBuilder()
    .setName('update-topic')
    .setDescription('Update a topic for Water Cooler Wednesdays 💦')
    .addNumberOption(option =>
        option.setName('topic-id').setDescription('The topic to update').setRequired(true),
    )
    .addStringOption(option =>
        option.setName('topic').setDescription('What should it update to?').setRequired(true),
    );

export async function execute(interaction: CommandInteraction<CacheType>) {
    const topicId = interaction.options.getNumber('topic-id') as number;
    const topic = interaction.options.getString('topic') as string;
    const member = interaction.member as GuildMember;

    if (!member.roles.cache.has(CONSTANTS.MODERATOR_ROLE_ID)) {
        await interaction.reply({
            content: '🚨 You do not have privileges to update WCW topics',
            ephemeral: true,
        });
        return;
    }

    await Promise.all([
        updateTopic(topicId, topic),
        interaction.reply({
            content: 'Topic has been updated ✅',
            ephemeral: true,
        }),
        logger({
            project: 'blacc',
            channel: 'general',
            event: `Topic ${topicId} has been updated`,
            description: `Called by ${member.user.tag}`,
            icon: '🟢',
            notify: true,
        }),
    ]);
}
