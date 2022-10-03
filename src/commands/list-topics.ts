import { CommandInteraction, CacheType, GuildMember } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import logger from '../utils/logger';
import { listTopics } from '../lib/listTopics';
import { formatTopics } from '../lib/formatTopics';

export const data = new SlashCommandBuilder()
    .setName('list-topics')
    .setDescription('List topics for 💦 Water Cooler Wednesdays');

export async function execute(interaction: CommandInteraction<CacheType>) {
    const member = interaction.member as GuildMember;
    const topics = await listTopics();

    const notUsed = topics.filter(item => !item.used);
    const used = topics.filter(item => item.used);

    await Promise.all([
        interaction.reply({
            content: `Not used:\n${formatTopics(notUsed)}\n\nUsed:\n${formatTopics(used)}`,
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
