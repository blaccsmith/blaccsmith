const cron = require('node-cron');
import { TextChannel } from 'discord.js';
import { client } from '../index';
import { CONSTANTS } from '../constants';
import { formatISO } from 'date-fns';
import { scheduledEvent } from '../utils/scheduled-event';

/**
 * Good news Friday
 */
export const run = () => {
    // Main event
    scheduledEvent({
        scheduling: '0 0 * * FRI',
        scheduledStartTime: new Date(Date.now() + 1000 * 3600 * 8),
        scheduledEndTime: new Date(Date.now() + 1000 * 3600 * 16),
        name: 'Good News Friday 🥳',
        description:
            "It's Good News Friday and we want to celebrate your wins this week! Come share your accomplishments with us!",
        channel: CONSTANTS.GENERAL_CHANNEL_ID,
        entityType: 'EXTERNAL',
        entityMetadata: { location: '#general channel' },
    });

    // Message memebers
    cron.schedule('*/5 * * * * *' ?? '0 8 * * FRI', async () => {
        const date = formatISO(new Date(), { representation: 'date' });
        const guild = client.guilds.cache.get(CONSTANTS.GUILD_ID);
        const channel = guild?.channels.cache.get(CONSTANTS.GENERAL_CHANNEL_ID) as TextChannel;
        console.log('works !');

        const createdMessage = await channel.send({
            content: `It's Good News Friday and we want to celebrate your wins this week <@&${CONSTANTS.MEMBER_ROLE_ID}> 🥳 Comment in this thread with your small wins, something exciting that happened, etc. this week! Can be related to your job, a side project, or life in general - we wanna know about it and celebrate you!`,
        });

        await createdMessage.startThread({
            name: `GNF 🎊 ${date}`,
            reason: 'Bringing good Friday vibes',
        });
    });
};
