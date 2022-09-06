import { CacheType, CommandInteraction, GuildMember } from 'discord.js';

export const socials = {
    github: 'https://github.com',
    linkedin: 'https://linkedin.com/in',
    twitter: 'https://twitter.com',
};

export const formatSocial = (name: keyof typeof socials, value: string) => {
    // Strip any trailing slashes
    let linkText = value.replace(/\/+$/, '')
    // Get last path segment from any URL format
    linkText = linkText.split('/').pop() ?? linkText;
    // Strip @ prefix
    linkText = (linkText.indexOf('@') == 0) ? linkText.substring(1) : linkText;

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
