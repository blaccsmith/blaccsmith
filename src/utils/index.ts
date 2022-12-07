import { CacheType, CommandInteraction, GuildMember } from 'discord.js';
import { Link } from '../lib/updateProfile';

export const socials = {
    github: 'https://github.com',
    linkedin: 'https://linkedin.com/in',
    twitter: 'https://twitter.com',
};

export const formatSocial = (name: keyof typeof socials, value: string) => {
    // Strip any trailing slashes
    let linkText = value.replace(/\/+$/, '');
    // Get last path segment from any URL format
    linkText = linkText.split('/').pop() ?? linkText;
    // Strip @ prefix
    linkText = linkText.indexOf('@') == 0 ? linkText.substring(1) : linkText;

    return [`${socials[name]}/${linkText}`, `[View](${socials[name]}/${linkText})`];
};

export const getUpdatedLinks = (
    oldLinks: Map<string, string | undefined | null>,
    newLinks: { name: string; value: any }[],
): Link[] => {
    const updatedLinks = newLinks.map(link => {
        const name = link.name;
        const value = link.value;

        const data: any = {
            inline: true,
            name: link!.name[0].toUpperCase() + link!.name.slice(1),
        };

        if (value) {
            data['rawUrl'] = formatSocial(name as keyof typeof socials, value as string)[0];
            data['value'] = formatSocial(name as keyof typeof socials, value as string)[1];
            return data;
        }

        const length = oldLinks.get(name)?.length as unknown as number;

        return {
            ...data,
            rawUrl: oldLinks.get(name)?.substring(7, length - 1),
            value: oldLinks.get(name),
        };
    }, oldLinks);

    return updatedLinks;
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
