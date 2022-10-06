import { GuildMember, TextChannel, Message } from 'discord.js';
import { client } from '..';
import { CONSTANTS } from '../constants';

export const deleteOnBoardingMessage = async (member: GuildMember) => {
    const onBoardingChannel = (await client.channels.fetch(
        CONSTANTS.ONBOARDING_CHANNEL_ID,
    )) as TextChannel;

    const onBoardingMessages = await onBoardingChannel.messages.fetch({ limit: 10 });
    const message = onBoardingMessages.find((message: Message) =>
        message.content.includes(member.id),
    );

    if (message) {
        await message.delete();
    }
};
