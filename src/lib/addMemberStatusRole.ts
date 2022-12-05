import { CommandInteractionOption, CacheType, GuildMember } from 'discord.js';
import { CONSTANTS } from '../constants';

export const addMemberStatusRole = (
    member: GuildMember,
    status: CommandInteractionOption<CacheType>,
) => {
    status!.value !== 'Other' &&
        member.roles.add(
            CONSTANTS.MEMBER_STATUSES[status!.value as keyof typeof CONSTANTS.MEMBER_STATUSES],
        );
};
