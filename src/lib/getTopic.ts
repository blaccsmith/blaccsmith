import { PrismaClient } from '@prisma/client';

export const getTopic = async (topicId: number) => {
    const prisma = new PrismaClient();

    return await prisma.wcwTopic.findUnique({
        where: { id: topicId },
    });
};
