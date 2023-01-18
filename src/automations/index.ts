import { schedule } from 'node-cron';
import { GuildScheduledEventCreateOptions } from 'discord.js';
import { client } from '..';
import { CONSTANTS } from '../constants';
import { events, jobs } from './index.json';

const scheduleOptions = { timezone: 'America/Chicago' };

export default function run() {
    jobs.forEach(job => {
        const callback = require(`./${job.callback}`);
        schedule(job.expression, callback.default, scheduleOptions);
    });

    events.forEach(event => {
        const guild = client.guilds.cache.get(CONSTANTS.GUILD_ID);
        const channel = guild?.channels.cache.find(({ name }) => name === event.channel)?.id;

        const options = {
            ...event,
            ...CONSTANTS.DEFAULT_EVENT_OPTIONS,
            channel,
        } as GuildScheduledEventCreateOptions;

        schedule(event.expression, () => guild?.scheduledEvents.create(options), scheduleOptions);
    });
}
