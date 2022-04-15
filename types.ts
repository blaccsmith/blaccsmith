import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, CacheType } from 'discord.js';

export interface CommandType {
    data: SlashCommandBuilder;
    execute: (interaction: CommandInteraction<CacheType>) => Promise<void>;
}
