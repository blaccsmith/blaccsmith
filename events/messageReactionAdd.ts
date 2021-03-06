import { MessageReaction, User } from 'discord.js';
import { client } from '..';
import { CONSTANTS } from '../constants';
import logger from '../utils/logger';

export const name = 'messageReactionAdd';

export const execute = async (reaction: MessageReaction, user: User) => {
    if (reaction.message.id !== CONSTANTS.COMMUNITY_GUIDELINES_MESSAGE_ID) return;
    if (reaction.emoji.name !== 'â') {
        console.log(`âšī¸ Incorrect reaction to community guidelines â ${user.tag}`);

        try {
            await reaction.remove();
            return;
        } catch (error) {
            console.error('Failed to remove reactions.');
        }
    }

    const guild = await client.guilds.fetch(CONSTANTS.GUILD_ID);
    const member = await guild.members.fetch(user.id);

    if (member.roles.cache.every(role => role.name === '@everyone')) {
        await member.roles.add(CONSTANTS.MEMBER_ROLE_ID);
    }

    await logger({
        project: 'blacc',
        channel: 'community-guidelines',
        event: 'Accepted community guidelines',
        description: user.tag,
        icon: 'đĸ',
        notify: true,
    });
};
