import { PrismaClient } from '@prisma/client';

export const deleteTopic = async (id: number) => {
    const prisma = new PrismaClient();

    return await prisma.wcwTopic.delete({
        where: { id },
    });
};
