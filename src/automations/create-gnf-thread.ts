import { formatISO } from 'date-fns';
import { TextChannel } from 'discord.js';
import { client } from '..';
import { CONSTANTS } from '../constants';

export default async function run() {
    const date = formatISO(new Date(), { representation: 'date' });
    const guild = client.guilds.cache.get(CONSTANTS.GUILD_ID);
    const channel = guild?.channels.cache.get(CONSTANTS.GENERAL_CHANNEL_ID) as TextChannel;

    const createdMessage = await channel.send({
        content: `It's Good News Friday and we want to celebrate your wins this week <@&${CONSTANTS.MEMBER_ROLE_ID}> 🥳 Comment in this thread with your small wins, something exciting that happened, etc. this week! Can be related to your job, a side project, or life in general - we wanna know about it and celebrate you!`,
    });

    await createdMessage.startThread({
        name: `GNF 🎊 ${date}`,
        reason: 'Bringing good Friday vibes',
    });
}
