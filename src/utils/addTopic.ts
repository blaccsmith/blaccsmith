import { PrismaClient } from '@prisma/client';

export const addTopic = async (topic: string) => {
    const prisma = new PrismaClient();
    return await prisma.wcwTopic.create({
        data: {
            used: false,
            topic,
        },
    });
};
