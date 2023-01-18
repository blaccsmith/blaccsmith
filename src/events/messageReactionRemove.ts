import { MessageReaction, User } from 'discord.js';
import { client } from '..';
import { CONSTANTS } from '../constants';
import logger from '../utils/logger';

export const name = 'messageReactionRemove';

export const execute = async (reaction: MessageReaction, user: User) => {
    if (reaction.message.id !== CONSTANTS.COMMUNITY_GUIDELINES_MESSAGE_ID) return;

    const guild = await client.guilds.fetch(CONSTANTS.GUILD_ID);
    const member = await guild.members.fetch(user.id);

    if (member.roles.cache.has(CONSTANTS.ONBOARDING_ROLE_ID)) {
        await member.roles.remove(CONSTANTS.ONBOARDING_ROLE_ID);
    } else if (member.roles.cache.has(CONSTANTS.MEMBER_ROLE_ID)) {
        await member.roles.remove(CONSTANTS.MEMBER_ROLE_ID);
        await member.roles.add(CONSTANTS.ONBOARDING_ROLE_ID);
    }

    await logger({
        project: 'blacc',
        channel: 'community-guidelines',
        event: 'Rejected community guidelines',
        description: user.tag,
        icon: '🟠',
        notify: true,
    });
};
