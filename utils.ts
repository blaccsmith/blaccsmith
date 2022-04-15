import fs from 'node:fs';

export const getCommandFiles = () => fs.readdirSync('./dist/commands').filter(file => file.endsWith('.js'));
