import { CommandInteraction, CacheType, Guild } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

export const data = new SlashCommandBuilder()
    .setName('server')
    .setDescription('Replies with server info!');

export async function execute(interaction: CommandInteraction<CacheType>) {
    const guild = interaction.guild as Guild;
    const message = `Server name: ${guild.name}\nTotal members: ${guild.memberCount}`;

    await interaction.reply(message);
}
