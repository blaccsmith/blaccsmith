import { PrismaClient } from '@prisma/client';
import { formatISO } from 'date-fns';
import { TextChannel } from 'discord.js';
import { client } from '..';
import { CONSTANTS } from '../constants';
import logger from '../utils/logger';

export default async function run() {
    const prisma = new PrismaClient();

    const date = formatISO(new Date(), { representation: 'date' });
    const guild = client.guilds.cache.get(CONSTANTS.GUILD_ID);
    const channel = guild?.channels.cache.get(CONSTANTS.GENERAL_CHANNEL_ID) as TextChannel;
    const data = await prisma.wcwTopic.findFirst({
        where: { used: false },
    });

    if (!data) {
        const channel = client.channels.cache.get(CONSTANTS.MODERATOR_CHANNEL_ID) as TextChannel;

        await Promise.allSettled([
            channel.send(
                'All Water Cooler Wednesday topics have been used ❗️ You will need to manually create the thread',
            ),
            logger({
                project: 'blacc',
                channel: 'general',
                event: 'Failed WCW thread',
                description: 'No topic available for Water Cooler Wednesday',
                icon: '🔴',
                notify: true,
            }),
        ]);

        return;
    }

    const createdMessage = await channel.send({
        content: `It's 💦 Water Cooler Wednesday <@&${CONSTANTS.MEMBER_ROLE_ID}> 🥳 Today, we're chatting about \`${data.topic}?\` 👀 Have an interesting opinion or something you want to share, let us know!`,
    });

    await Promise.allSettled([
        createdMessage.startThread({
            name: `💦 Water Cooler Wednesday ${date}`,
            reason: 'Engaging topics for members',
        }),
        prisma.wcwTopic.update({
            where: { id: data.id },
            data: { used: true },
        }),
    ]);
}
