import { PrismaClient } from '@prisma/client';
import { TextChannel } from 'discord.js';
import { client } from '..';
import { CONSTANTS } from '../constants';

export default async function run() {
    const prisma = new PrismaClient();

    const data = await prisma.wcwTopic.findFirst({
        where: { used: false },
    });

    if (!data) {
        const channel = client.channels.cache.get(CONSTANTS.MODERATOR_CHANNEL_ID) as TextChannel;
        return await channel.send(
            'All Water Cooler Wednesday topics have been used ❗️ Add a new one with `/update-wcw` command',
        );
    }
}
