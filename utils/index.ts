import { ColorResolvable, EmbedAuthorData, MessageEmbed } from 'discord.js';
import fs from 'node:fs';

export const getCommandFiles = () =>
    fs.readdirSync('./dist/commands').filter(file => file.endsWith('.js'));
export const getEventFiles = () =>
    fs.readdirSync('./dist/events').filter(file => file.endsWith('.js'));
export const embedMessage = ({
    title,
    description,
    color,
    author,
}: {
    title: string;
    description: string;
    color: ColorResolvable;
    author: EmbedAuthorData;
}) => {
    return new MessageEmbed()
        .setColor(color)
        .setTitle(title)
        .setAuthor(author)
        .setDescription(description)
        .setTimestamp();
};
