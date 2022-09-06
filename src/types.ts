import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, CacheType, Client, Collection } from 'discord.js';

export interface CommandType {
    data: SlashCommandBuilder;
    execute: (interaction: CommandInteraction<CacheType>) => Promise<void>;
}

export type ClientWithCommands = Client & { commands?: Collection<string, any> };

export interface LogBody {
    project: string;
    channel: string;
    event: string;
    description: string;
    icon: string;
    notify: boolean;
}

export interface ScheduledEvent {
    name: string;
    channel: string;
    scheduling: string;
    scheduledStartTime: Date;
    scheduledEndTime: Date;
    description: string;
    entityType: 'EXTERNAL' | 'STAGE_INSTANCE' | 'VOICE';
    entityMetadata: {
        location: string;
    };
}
