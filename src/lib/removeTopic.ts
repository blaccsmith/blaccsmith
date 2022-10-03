import { PrismaClient } from '@prisma/client';

export const removeTopic = async (id: number) => {
    const prisma = new PrismaClient();
    return await prisma.wcwTopic.delete({
        where: { id },
    });
};
