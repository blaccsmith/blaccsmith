import fs from 'node:fs';

export const getCommandFiles = () =>
    fs.readdirSync('./dist/commands').filter(file => file.endsWith('.js'));

export const getEventFiles = () =>
    fs.readdirSync('./dist/events').filter(file => file.endsWith('.js'));

export const getAutomations = () =>
    fs.readdirSync('./dist/automations').filter(file => file.endsWith('.js'));
