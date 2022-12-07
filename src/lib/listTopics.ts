import { PrismaClient } from '@prisma/client';

export const listTopics = async () => {
    const prisma = new PrismaClient();
    return await prisma.wcwTopic.findMany();
};
