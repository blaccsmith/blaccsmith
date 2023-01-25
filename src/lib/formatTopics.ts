import { wcwTopic } from '@prisma/client';
import { client } from '..';

export const formatTopics = (data: wcwTopic[]) => {
    return data.reduce((acc, curr) => {
        const user = client.users.cache.find(u => u.id === curr.authorId)

        return acc += `${curr.used ? '' : `${curr.id}: `}${curr.topic}${user ? `by (${user.tag})` : ''}\n`
    }, '');
};
