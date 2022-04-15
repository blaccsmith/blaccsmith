import { GuildMember } from 'discord.js';

export const name = 'guildMemberAdd';

export const execute = async (member: GuildMember) => {
    console.log({ member });
    const role = member.user.send('Welcome to the server!');
};
