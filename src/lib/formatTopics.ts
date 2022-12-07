import { wcwTopic } from '@prisma/client';

export const formatTopics = (data: wcwTopic[]) => {
    return data.reduce((acc, curr) => (acc += `id: ${curr.id} - ${curr.topic}\n`), '');
};
