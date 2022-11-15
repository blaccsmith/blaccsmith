import { MessageReaction, TextChannel, User } from 'discord.js';
import { client } from '..';
import { CONSTANTS } from '../constants';
import logger from '../utils/logger';

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
    const channel = guild.channels.cache.get(CONSTANTS.ONBOARDING_CHANNEL_ID) as TextChannel;

    if (member.roles.cache.every(role => role.name === '@everyone')) {
        await Promise.all([
            member.roles.add(CONSTANTS.ONBOARDING_ROLE_ID),
            channel.send(
                `Hey <@${member.id}>! \nCheck the pinned message 👆 for instructions on how to use the /intro slash command so you can introduce yourself and get access to all channels 😎`,
            ),
        ]);
    } else if (member.roles.cache.has(CONSTANTS.ONBOARDING_ROLE_ID)) {
        await Promise.all([
            member.roles.remove(CONSTANTS.ONBOARDING_ROLE_ID),
            member.roles.add(CONSTANTS.MEMBER_ROLE_ID),
        ]);
    }

    await logger({
        project: 'blacc',
        channel: 'community-guidelines',
        event: 'Accepted community guidelines',
        description: user.tag,
        icon: '🟢',
        notify: true,
    });
};
