const cron = require('node-cron');
import { client } from '..';
import { CONSTANTS } from '../constants';
import { ScheduledEvent } from '../types';
import { GuildScheduledEventCreateOptions } from 'discord.js';
import logger from './logger';

export const scheduledEvent = async ({
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
        async () => {
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

            if (!guild) {
                await logger({
                    project: 'blacc',
                    channel: 'Events',
                    event: 'Schedueld Event',
                    description: 'Failed creating scheduled event',
                    icon: '🔴',
                    notify: true,
                });
                return;
            }

            await guild.scheduledEvents.create(options);
            console.log('Event scheduled!');
        },
        {
            scheduled: true,
            timezone: 'America/Chicago',
        },
    );
};
