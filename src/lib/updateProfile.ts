import { PrismaClient } from '@prisma/client';
import { CommandInteractionOptionValue } from '../commands/update-profile';

export type Link = {
    name: string;
    value: CommandInteractionOptionValue;
    rawUrl: string;
    inline: boolean;
};
interface UpdateProfileArgs {
    id: string;
    intro: string | null;
    status?: any;
    links: Link[];
}

export const updateProfile = async (args: UpdateProfileArgs) => {
    const prisma = new PrismaClient();

    const profileData = {
        intro: args.intro,
        discordId: args.id,
        status: (args.status?.value ?? args.status) as string,
        github: args.links.find(link => link.name === 'Github')?.rawUrl,
        linkedin: args.links.find(link => link.name === 'Linkedin')?.rawUrl,
        twitter: args.links.find(link => link.name === 'Twitter')?.rawUrl,
    };

    await prisma.user.upsert({
        where: { discordId: args.id },
        create: { discordId: args.id, profile: { create: profileData } },
        update: { profile: { upsert: { create: profileData, update: profileData } } },
    });
};
