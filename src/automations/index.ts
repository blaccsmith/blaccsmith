import { schedule } from 'node-cron';
import { GuildScheduledEventCreateOptions } from 'discord.js';
import { client } from '..';
import { CONSTANTS } from '../constants';
import automations from './index.json';

export default function run() {
    automations.forEach(({ type, ...details }) => {
        if (type === 'job') {
            const callback = require(`./${details.callback}`);
            schedule(details.expression, callback.default);
        } else {
            const guild = client.guilds.cache.get(CONSTANTS.GUILD_ID);
            const channel = guild?.channels.cache.find(
                ({ name }) => name === automations[0].channel,
            )?.id;

            const options = {
                ...details,
                ...CONSTANTS.DEFAULT_EVENT_OPTIONS,
                channel,
            } as GuildScheduledEventCreateOptions;

            schedule(details.expression, () => guild?.scheduledEvents.create(options));
        }
    });
}
