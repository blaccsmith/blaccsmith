const cron = require('node-cron');
import { GuildScheduledEventCreateOptions } from 'discord.js';
import { client } from '..';
import { CONSTANTS } from '../constants';

interface ScheduledEvent {
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

export const discordScheduledEvent = async ({
    scheduling,
    scheduledStartTime,
    scheduledEndTime,
    name,
    description,
    channel,
    entityType,
    entityMetadata,
}: ScheduledEvent): Promise<void> => {
    return cron.schedule(
        scheduling,
        () => {
            const options: GuildScheduledEventCreateOptions = {
                name,
                channel,
                privacyLevel: 'GUILD_ONLY',
                description,
                entityType,
                scheduledStartTime,
                scheduledEndTime,
                entityMetadata,
            };

            const guild = client.guilds.cache.get(CONSTANTS.GUILD_ID);

            if (!guild) return;

            guild.scheduledEvents.create(options);
        },
        {
            scheduled: true,
            timezone: 'America/Chicago',
        },
    );
};
