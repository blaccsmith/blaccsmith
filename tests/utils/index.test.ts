import { formatSocial, getUpdatedLinks } from '../../src/utils/index';

describe('testing GitHub inputs', () => {
    test('username should result in full URL', () => {
        expect(formatSocial('github', 'user')).toEqual([
            'https://github.com/user',
            '[View](https://github.com/user)',
        ]);
    });
    test('@username should result in full URL', () => {
        expect(formatSocial('github', '@user')).toEqual([
            'https://github.com/user',
            '[View](https://github.com/user)',
        ]);
    });
    test('partial URL should result in full URL', () => {
        expect(formatSocial('github', 'github.com/user')).toEqual([
            'https://github.com/user',
            '[View](https://github.com/user)',
        ]);
    });
    test('full URL should result in full URL', () => {
        expect(formatSocial('github', 'https://github.com/user')).toEqual([
            'https://github.com/user',
            '[View](https://github.com/user)',
        ]);
    });
    test('full URL with trailing slash should result in full URL', () => {
        expect(formatSocial('github', 'https://github.com/user/')).toEqual([
            'https://github.com/user',
            '[View](https://github.com/user)',
        ]);
    });
});

describe('testing LinkedIn inputs', () => {
    test('username should result in full URL', () => {
        expect(formatSocial('linkedin', 'user')).toEqual([
            'https://linkedin.com/in/user',
            '[View](https://linkedin.com/in/user)',
        ]);
    });
    test('@username should result in full URL', () => {
        expect(formatSocial('linkedin', '@user')).toEqual([
            'https://linkedin.com/in/user',
            '[View](https://linkedin.com/in/user)',
        ]);
    });
    test('partial URL should result in full URL', () => {
        expect(formatSocial('linkedin', 'linkedin.com/in/user')).toEqual([
            'https://linkedin.com/in/user',
            '[View](https://linkedin.com/in/user)',
        ]);
    });
    test('full URL should result in full URL', () => {
        expect(formatSocial('linkedin', 'https://linkedin.com/in/user')).toEqual([
            'https://linkedin.com/in/user',
            '[View](https://linkedin.com/in/user)',
        ]);
    });
    test('full URL with trailing slash should result in full URL', () => {
        expect(formatSocial('linkedin', 'https://linkedin.com/in/user/')).toEqual([
            'https://linkedin.com/in/user',
            '[View](https://linkedin.com/in/user)',
        ]);
    });
});

describe('testing Twitter inputs', () => {
    test('username should result in full URL', () => {
        expect(formatSocial('twitter', 'user')).toEqual([
            'https://twitter.com/user',
            '[View](https://twitter.com/user)',
        ]);
    });
    test('@username should result in full URL', () => {
        expect(formatSocial('twitter', '@user')).toEqual([
            'https://twitter.com/user',
            '[View](https://twitter.com/user)',
        ]);
    });
    test('partial URL should result in full URL', () => {
        expect(formatSocial('twitter', 'twitter.com/user')).toEqual([
            'https://twitter.com/user',
            '[View](https://twitter.com/user)',
        ]);
    });
    test('full URL should result in full URL', () => {
        expect(formatSocial('twitter', 'https://twitter.com/user')).toEqual([
            'https://twitter.com/user',
            '[View](https://twitter.com/user)',
        ]);
    });
    test('full URL with trailing slash should result in full URL', () => {
        expect(formatSocial('twitter', 'https://twitter.com/user/')).toEqual([
            'https://twitter.com/user',
            '[View](https://twitter.com/user)',
        ]);
    });
});

describe('Testing getUpdatedLinks', () => {
    const oldLinks = new Map<string, string | undefined>([
        ['github', '[View](https://github.com/user)'],
        ['linkedin', '[View](https://linkedin.com/in/user)'],
        ['twitter', '[View](https://twitter.com/user)'],
    ]);
    const newLinks = [
        {
            name: 'github',
            value: 'user',
        },
        { name: 'linkedin', value: 'user' },
        { name: 'twitter', value: 'user' },
    ];

    const value = [
        {
            inline: true,
            name: 'Github',
            rawUrl: 'https://github.com/user',
            value: '[View](https://github.com/user)',
        },
        {
            inline: true,
            name: 'Linkedin',
            rawUrl: 'https://linkedin.com/in/user',
            value: '[View](https://linkedin.com/in/user)',
        },
        {
            inline: true,
            name: 'Twitter',
            rawUrl: 'https://twitter.com/user',
            value: '[View](https://twitter.com/user)',
        },
    ];

    test('Should update all links', () => {
        const expectedReturnedValue = value;
        expect(getUpdatedLinks(oldLinks, newLinks)).toEqual(expectedReturnedValue);
    });

    test('Should update 1 link', () => {
        const expectedReturnedValue = JSON.parse(JSON.stringify(value));
        const newValue = 'newUser';
        expectedReturnedValue[0]['rawUrl'] = `https://github.com/${newValue}`;
        expectedReturnedValue[0]['value'] = `[View](https://github.com/${newValue})`;

        const updatedNewLinks = newLinks.map(link => {
            if (link.name === 'github') {
                return {
                    ...link,
                    value: newValue,
                };
            }
            return link;
        });

        expect(getUpdatedLinks(oldLinks, updatedNewLinks)).toEqual(expectedReturnedValue);
    });

    test('Should update 0 links', () => {
        const expectedReturnedValue = JSON.parse(JSON.stringify(value));

        const emptyLinks = newLinks.map(v => {
            return {
                ...v,
                value: undefined,
            };
        });

        expect(getUpdatedLinks(oldLinks, emptyLinks)).toEqual(expectedReturnedValue);
    });

    test('Should update without any new or old links', () => {
        const expectedReturnedValue = JSON.parse(JSON.stringify(value));

        oldLinks.forEach(val => (val = undefined));

        const newEmptyLinks = newLinks.map(v => {
            return {
                ...v,
                value: undefined,
            };
        });

        expect(getUpdatedLinks(oldLinks, newEmptyLinks)).toEqual(expectedReturnedValue);
    });
});
