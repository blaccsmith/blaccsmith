import { GuildMember } from 'discord.js';

export const name = 'guildMemberAdd';

const welcomeMessage = `
**Welcome to BLACC 👋🏾 We're a community of like-minded developers from around the world 🌍 focused on educating, collaborating with, and uplifting each other! To keep BLACC a safe and open environment for all, we need to ask you to follow these two steps in order to become a full member of our server**:

1. Confirm acceptance of our community guidelines by reacting to the pinned message in the community-guidelines channel with a ✅

2. Introduce yourself by using the /intro command in the welcome channel

Please note that both steps must be completed in order to be granted access to all channels.

We hope this space is inviting and impactful for you! ✨ Protip: tell us about a project you're working on — showcase is perfect for that.
`;

export const execute = async (member: GuildMember) => {
    await member.user.send(welcomeMessage);
};
