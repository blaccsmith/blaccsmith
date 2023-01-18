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
