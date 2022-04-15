import { CommandInteraction, CacheType } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

export const data = new SlashCommandBuilder()
    .setName('user')
    .setDescription('Replies with user info!');

export async function execute(interaction: CommandInteraction<CacheType>) {
    const message = `Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`;
    await interaction.reply(message);
}
