import { CacheType, CommandInteraction, GuildMember } from 'discord.js';

export const socials = {
    github: 'https://github.com',
    linkedin: 'https://linkedin.com/in',
    twitter: 'https://twitter.com',
};

export const formatSocial = (name: keyof typeof socials, value: string) => {
    const linkText = name === 'linkedin' ? value.split('in/').pop() : value;
    return [`${socials[name]}/${linkText}`, `[View](${socials[name]}/${linkText})`];
};

export const getLinkName = (link: string) =>
    link?.includes('github') ? 'github' : link?.includes('linkedin') ? 'linkedin' : 'twitter';

export const messageReply = async (
    interaction: CommandInteraction<CacheType>,
    message: string,
    searchedMember: GuildMember,
) => {
    const username = interaction.options.getString('username');
    return await Promise.all([
        interaction.reply({
            content: `${username} does not have their profile configured`,
            ephemeral: true,
        }),
        searchedMember.send(message),
    ]);
};
