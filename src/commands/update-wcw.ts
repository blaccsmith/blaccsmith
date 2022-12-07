import {
    CommandInteraction,
    CacheType,
    GuildMember,
    MessageComponentInteraction,
} from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CONSTANTS } from '../constants';
import { addTopic } from '../lib/addTopic';
import logger from '../utils/logger';
import { ConfirmationButton } from '../lib/components/confirmation-button';

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

    await interaction.reply({
        content: `Are you sure you want to add the topic: ${topic}?`,
        components: ConfirmationButton,
    });

    const filter = (i: MessageComponentInteraction<'cached'>) =>
        i.customId === 'confirm' || i.customId === 'cancel';

    const collector = interaction.channel?.createMessageComponentCollector({ filter, time: 10000 });

    collector?.on('collect', async (i: any) => {
        if (i.customId === 'confirm') {
            await Promise.all([
                addTopic(topic),
                interaction.editReply({
                    content: `✅ Topic added: ${topic}`,
                    components: [],
                }),
                logger({
                    project: 'blacc',
                    channel: 'general',
                    event: 'WCW topic added',
                    description: `Added by ${member.user.tag}`,
                    icon: '🟢',
                    notify: true,
                }),
            ]);
        } else if (i.customId === 'cancel') {
            await Promise.all([
                interaction.editReply({
                    content: `❌ Topic not added: ${topic}`,
                    components: [],
                }),
                logger({
                    project: 'blacc',
                    channel: 'general',
                    event: 'Adding WCW topic cancelled',
                    description: `Added by ${member.user.tag}`,
                    icon: '🔴',
                    notify: true,
                }),
            ]);
        }
    });

    collector?.on('end', async collected => {
        if (collected.size === 0) {
            await Promise.all([
                interaction.editReply({
                    content: '❌ You did not confirm or cancel in time',
                    components: [],
                }),
                logger({
                    project: 'blacc',
                    channel: 'general',
                    event: 'Adding wcw topic timed out',
                    description: `Added by ${member.user.tag}`,
                    icon: '🔴',
                    notify: true,
                }),
            ]);
        }
    });
}
