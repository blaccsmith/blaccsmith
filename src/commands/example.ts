import { CommandInteraction, CacheType } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

export const data = new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!');

export async function execute(interaction: CommandInteraction<CacheType>) {
    await interaction.reply('Pong!');
}
