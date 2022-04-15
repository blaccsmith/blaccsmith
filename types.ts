import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, CacheType, Client, Collection } from 'discord.js';

export interface CommandType {
    data: SlashCommandBuilder;
    execute: (interaction: CommandInteraction<CacheType>) => Promise<void>;
}

export type ClientWithCommands = Client & { commands?: Collection<string, any> };
