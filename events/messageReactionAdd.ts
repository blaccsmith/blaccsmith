import { MessageReaction, User } from 'discord.js';
import { CONSTANTS } from '../constants';

export const name = 'messageReactionAdd';

export const execute = async (reaction: MessageReaction, user: User) => {
    if (reaction.message.id !== CONSTANTS.RULES_MESSAGE_ID) return;
    if (reaction.emoji.name !== '✅') {
        // Get user's reactions from the message
        const userReactions = reaction.message.reactions.cache.filter(reaction =>
            reaction.users.cache.has(user.id),
        );

        try {
            await userReactions.first()?.users.remove(user);
        } catch (error) {
            console.error('Failed to remove reactions.');
        }
    }
};
