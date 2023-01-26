import { User } from 'discord.js';

export const notifyUser = async (senderId: string, user: User | undefined, message: string) => {
    if (user && senderId !== user.id) {
        return await user.send(message);
    }
};
