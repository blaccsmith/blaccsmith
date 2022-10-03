import { CommandInteraction, CacheType, GuildMember } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CONSTANTS } from '../constants';
import { addTopic } from '../lib/addTopic';
import logger from '../utils/logger';

export const data = new SlashCommandBuilder()
    .setName('update-wcw')
    .setDescription('Add a topic for Water Cooler Wednesdays 💦')
    .addStringOption(option =>
        option.setName('topic').setDescription('Your topic').setRequired(true),
    );

export async function execute(interaction: CommandInteraction<CacheType>) {
    const topic = interaction.options.getString('topic') as string;
    const member = interaction.member as GuildMember;

    if (!member.roles.cache.has(CONSTANTS.MODERATOR_ROLE_ID)) {
        await interaction.reply({
            content: '🚨 You do not have privileges to add WCW topics',
            ephemeral: true,
        });
        return;
    }

    await Promise.all([
        addTopic(topic),
        interaction.reply({
            content: 'Topic has been added ✅',
            ephemeral: true,
        }),
        logger({
            project: 'blacc',
            channel: 'general',
            event: 'WCW topic added',
            description: `Called by ${member.id}`,
            icon: '🟢',
            notify: true,
        }),
    ]);
}
