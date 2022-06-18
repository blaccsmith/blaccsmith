import { ColorResolvable, EmbedAuthorData, MessageEmbed, MessageEmbedThumbnail } from 'discord.js';
import fs from 'node:fs';

export const getCommandFiles = () =>
    fs.readdirSync('./dist/commands').filter(file => file.endsWith('.js'));

export const getEventFiles = () =>
    fs.readdirSync('./dist/events').filter(file => file.endsWith('.js'));

export const formatUrl = (name: string, value: string) => {
    if (value.startsWith('@')) value = value.substring(1, value.length);
    return `https://www.${name}.com/${value}`;
};

export const embedMessage = ({
    title,
    description,
    color,
    author,
    thumbnail,
    links,
}: {
    title: string;
    description: string;
    color: ColorResolvable;
    author: EmbedAuthorData;
    thumbnail?: string;
    links?: { name: string; value: string; inline: boolean }[];
}) => {
    let message = new MessageEmbed();

    if (thumbnail) {
        message
            .setColor(color)
            .setTitle(title)
            .setAuthor(author)
            .setDescription(description)
            .setTimestamp()
            .setThumbnail(thumbnail);
        links?.map(link => message.addField(link.name, link.value, link.inline));
        return message;
    }

    return message
        .setColor(color)
        .setTitle(title)
        .setAuthor(author)
        .setDescription(description)
        .setTimestamp();
};
