import { PrismaClient } from '@prisma/client';

export const updateTopic = async (id: number, topic: string) => {
    const prisma = new PrismaClient();
    return await prisma.wcwTopic.update({
        where: { id },
        data: { topic },
    });
};
