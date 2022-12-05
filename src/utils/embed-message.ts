import { ColorResolvable, EmbedAuthorData, MessageEmbed } from 'discord.js';

interface EmbedMessage {
    title: string;
    description: string;
    color: ColorResolvable;
    status?: string;
    author?: EmbedAuthorData;
    thumbnail?: string;
    links?: { name: string; value: string; inline: boolean }[];
}

export const embedMessage = (data: EmbedMessage) => {
    const { title, description, color, author, thumbnail, links } = data;
    const message = new MessageEmbed();

    if (thumbnail) {
        message
            .setColor(color)
            .setTitle(title)
            .setDescription(description)
            .setTimestamp()
            .setThumbnail(thumbnail);

        author && message.setAuthor(author);
        links?.forEach(link => message.addField(link.name, link.value, link.inline));
        return message;
    }

    author && message.setAuthor(author);

    data.status && message.addField('Status', data.status);
    console.log({ data, message });
    message.setColor(color).setTitle(title).setDescription(description).setTimestamp();

    return message;
};
