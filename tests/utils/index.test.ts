import { socials, formatSocial } from '../../src/utils/index';

describe('testing GitHub inputs', () => {
    test('GitHub username should result in full URL', () => {
        expect(formatSocial('github', 'user')).toEqual([ 'https://github.com/user', '[View](https://github.com/user)' ]);
    });
    test('GitHub @username should result in full URL', () => {
        expect(formatSocial('github', '@user')).toEqual([ 'https://github.com/user', '[View](https://github.com/user)' ]);
    });
    test('GitHub partial URL should result in full URL', () => {
        expect(formatSocial('github', 'github.com/user')).toEqual([ 'https://github.com/user', '[View](https://github.com/user)' ]);
    });
    test('GitHub full URL should result in full URL', () => {
        expect(formatSocial('github', 'https://github.com/user')).toEqual([ 'https://github.com/user', '[View](https://github.com/user)' ]);
    });
});

describe('testing LinkedIn inputs', () => {
    test('LinkedIn username should result in full URL', () => {
        expect(formatSocial('linkedin', 'user')).toEqual([ 'https://linkedin.com/in/user', '[View](https://linkedin.com/in/user)' ]);
    });
    test('LinkedIn @username should result in full URL', () => {
        expect(formatSocial('linkedin', '@user')).toEqual([ 'https://linkedin.com/in/user', '[View](https://linkedin.com/in/user)' ]);
    });
    test('LinkedIn partial URL should result in full URL', () => {
        expect(formatSocial('linkedin', 'linkedin.com/in/user')).toEqual([ 'https://linkedin.com/in/user', '[View](https://linkedin.com/in/user)' ]);
    });
    test('LinkedIn full URL should result in full URL', () => {
        expect(formatSocial('linkedin', 'https://linkedin.com/in/user')).toEqual([ 'https://linkedin.com/in/user', '[View](https://linkedin.com/in/user)' ]);
    });
});

describe('testing Twitter inputs', () => {
    test('Twitter username should result in full URL', () => {
        expect(formatSocial('twitter', 'user')).toEqual([ 'https://twitter.com/user', '[View](https://twitter.com/user)' ]);
    });
    test('Twitter @username should result in full URL', () => {
        expect(formatSocial('twitter', '@user')).toEqual([ 'https://twitter.com/user', '[View](https://twitter.com/user)' ]);
    });
    test('Twitter partial URL should result in full URL', () => {
        expect(formatSocial('twitter', 'twitter.com/user')).toEqual([ 'https://twitter.com/user', '[View](https://twitter.com/user)' ]);
    });
    test('Twitter full URL should result in full URL', () => {
        expect(formatSocial('twitter', 'https://twitter.com/user')).toEqual([ 'https://twitter.com/user', '[View](https://twitter.com/user)' ]);
    });
});