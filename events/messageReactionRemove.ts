import { MessageReaction, User } from 'discord.js';
import { client } from '..';
import { CONSTANTS } from '../constants';

export const name = 'messageReactionRemove';

export const execute = async (reaction: MessageReaction, user: User) => {
    if (reaction.message.id !== CONSTANTS.COMMUNITY_GUIDELINES_MESSAGE_ID) return;

    if (reaction.emoji.name === '✅') {
        const guild = await client.guilds.fetch(CONSTANTS.GUILD_ID);
        const member = await guild.members.fetch(user.id);

        if (member.roles.cache.has(CONSTANTS.MEMBER_ROLE_ID)) {
            await member.roles.remove(CONSTANTS.MEMBER_ROLE_ID);
            await member.roles.add(CONSTANTS.SPECTATOR_ROLE_ID);
            console.log(`🟠 Rejected community guidelines – ${user.tag}`);
        }
    }
};
