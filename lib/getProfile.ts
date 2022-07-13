import { PrismaClient } from '@prisma/client';

interface GetProfileArgs {
    userId: string;
}

export const getProfile = async (args: GetProfileArgs) => {
    const prisma = new PrismaClient();

    return prisma.profile.findFirst({
        where: { userId: args.userId },
    });
};
