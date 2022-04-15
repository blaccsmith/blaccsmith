import { MessageReaction, User } from 'discord.js';
import { client } from '..';
import { CONSTANTS } from '../constants';

export const name = 'messageReactionAdd';

export const execute = async (reaction: MessageReaction, user: User) => {
    if (reaction.message.id !== CONSTANTS.COMMUNITY_GUIDELINES_MESSAGE_ID) return;
    if (reaction.emoji.name !== '✅') {
        console.log(`ℹ️ Incorrect reaction to community guidelines – ${user.tag}`);

        try {
            await reaction.remove();
            return;
        } catch (error) {
            console.error('Failed to remove reactions.');
        }
    }

    const guild = await client.guilds.fetch(CONSTANTS.GUILD_ID);
    const member = await guild.members.fetch(user.id);

    if (member.roles.cache.has(CONSTANTS.SPECTATOR_ROLE_ID)) {
        await member.roles.add(CONSTANTS.MEMBER_ROLE_ID);
        await member.roles.remove(CONSTANTS.SPECTATOR_ROLE_ID);
    }
};
