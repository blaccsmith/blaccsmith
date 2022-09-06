import { CommandInteraction, CacheType, User } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CONSTANTS } from '../constants';
import timers from 'node:timers/promises';
import logger from '../utils/logger';

export const data = new SlashCommandBuilder()
    .setName('remind-me')
    .setDescription('🎗 Reminds you about a message someone said')
    .addStringOption(option =>
        option
            .setName('duration')
            .setDescription('When should we remind you?')
            .setRequired(true)
            .addChoices([
                ['in 5 seconds', '_5_SECONDS'],
                ['in 1 hour', '_1_HOUR'],
                ['in 6 hours', '_6_HOURS'],
                ['tomorrow', '_1_DAY'],
            ]),
    )
    .addStringOption(option =>
        option.setName('message').setDescription('Paste the message link here').setRequired(true),
    );

export async function execute(interaction: CommandInteraction<CacheType>) {
    const duration = interaction.options.get('duration');
    const message = interaction.options.getString('message');
    const interactionAuthor = interaction.member?.user as User;

    await logger({
        project: 'blacc',
        channel: 'remind-me',
        event: 'Reminder set',
        description: interactionAuthor.tag,
        icon: '🟡',
        notify: true,
    });
    await interaction.reply({
        content: `We'll remind you about this message soon!`,
        ephemeral: true,
    });

    await timers.setTimeout(CONSTANTS[duration?.value as keyof typeof CONSTANTS] as number);

    const author = await interaction.client.users.fetch(interaction.member?.user.id as string);
    await author.send({ content: `🎗 Here's your reminder: ${message}` });
    await logger({
        project: 'blacc',
        channel: 'remind-me',
        event: 'Reminder has been sent',
        description: interactionAuthor.tag,
        icon: '🟡',
        notify: true,
    });
}
