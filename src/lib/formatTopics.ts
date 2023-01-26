import { wcwTopic } from '@prisma/client';
import { Client } from 'discord.js';

export const formatTopics = (data: wcwTopic[], client: Client<boolean>) => {
    return data.reduce((acc, curr) => {
        const user = client.users.cache.find(u => u.id === curr.authorId);

        return (acc += `${curr.used ? '' : `${curr.id}. `}${curr.topic}${
            user ? ` (by: ${user.username})` : ''
        }\n`);
    }, '');
};
