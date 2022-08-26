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

export const runScheduledEvents = (events: (() => void)[]) => events.forEach(fn => fn());
