import { CommandInteraction, CacheType, GuildMember } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CONSTANTS } from '../constants';
import { addTopic } from '../lib/addTopic';
import logger from '../utils/logger';
import { listTopics } from '../lib/listTopics';

export const data = new SlashCommandBuilder()
    .setName('list-topics')
    .setDescription('List topics for 💦 Water Cooler Wednesdays');

export async function execute(interaction: CommandInteraction<CacheType>) {
    const member = interaction.member as GuildMember;
    const topics = await listTopics();

    const notUsed = topics
        .filter(item => !item.used)
        .map(item => item.topic)
        .join('\n');
    const used = topics
        .filter(item => item.used)
        .map(item => item.topic)
        .join('\n');

    await Promise.all([
        interaction.reply({
            content: `Not used:\n${notUsed}\n\nUsed:\n${used}`,
            ephemeral: true,
        }),
        logger({
            project: 'blacc',
            channel: 'general',
            event: 'Viewing WCW topics',
            description: `Called by ${member.id}`,
            icon: '🟢',
            notify: true,
        }),
    ]);
}
