import { GuildMember } from 'discord.js';

export const name = 'guildMemberAdd';

const welcomeMessage = `
**Welcome to BLACC 👋🏾 We're a community of like-minded developers from around the world 🌍 focused on educating, collaborating with, and uplifting each other! To keep BLACC a safe and open environment for all, you need to do two things:**

- In \`#community-guidelines\`, react to our community guidelines with a ✅
- In \`#welcome\`, introduce yourself using the \`\/intro\` command ✨

> **We hope this space is inviting and impactful to you! Some pro tips – tell us about a project your working on in \`#showcase\` is perfect for that.**
`;

export const execute = async (member: GuildMember) => {
    await member.user.send(welcomeMessage);
};
