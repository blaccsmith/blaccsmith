import { GuildMember, TextChannel, Message, CacheType, CommandInteraction } from 'discord.js';
import { CONSTANTS } from '../constants';

export const deleteOnBoardingMessage = async (
    interaction: CommandInteraction<CacheType>,
    member: GuildMember,
) => {
    const onBoardingChannel = (await interaction.client.channels.fetch(
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
