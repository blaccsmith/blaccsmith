import { Message } from 'discord.js';
import { client } from '..';
import { CONSTANTS } from '../constants';

export const name = 'messageCreate';

export const execute = async (message: Message) => {
    if (message.channelId !== CONSTANTS.WELCOME_CHANNEL_ID) return;
    const user = await message.author.fetch();
    const guild = await client.guilds.fetch(CONSTANTS.GUILD_ID);
    const member = guild.members.cache.get(user.id);

    if (member?.roles.cache.has(CONSTANTS.SPECTATOR_ROLE_ID)) {
        await member.roles.remove(CONSTANTS.SPECTATOR_ROLE_ID);
        await member.roles.add(CONSTANTS.MEMBER_ROLE_ID);
        console.log(`🟢 ${user.tag} introduced themselves to the server.`);
    }
};
