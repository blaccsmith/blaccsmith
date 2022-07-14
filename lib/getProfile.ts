import { PrismaClient } from '@prisma/client';

interface GetProfileArgs {
    discordId: string;
}

export const getProfile = async (args: GetProfileArgs) => {
    const prisma = new PrismaClient();

    return prisma.profile.findFirst({
        where: { discordId: args.discordId },
    });
};
