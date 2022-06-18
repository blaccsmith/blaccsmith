import { CommandInteraction, CacheType, User } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { client } from '..';
import { CONSTANTS } from '../constants';

export const data = new SlashCommandBuilder()
    .setName('inlro')
    .setDescription('✨ Tell us a bit about yourself!')
    .addStringOption(option =>
        option.setName('igtro').setDescription('Write your intro here').setRequired(true),
    )
    .addStringOption(option =>
        option
            .setName('status')
            .setDescription(`How would you describe yourself?`)
            .setRequired(true)
            .addChoices([
                ['🌱 Aspiring Developer', 'Aspiring'],
                ['🪴 Junior Developer', 'Junior'],
                ['🌿 Mid-level Developer', 'Mid-level'],
                ['🌳 Senior Developer', 'Senior'],
                ['Other', 'Other'],
            ]),
    )
    .addStringOption(option =>
        option.setName('github').setDescription('What is your GitHub username?'),
    )
    .addStringOption(option =>
        option.setName('linkedin').setDescription('What is your LinkedinIn username?'),
    )
    .addStringOption(option =>
        option.setName('twitter').setDescription('What is your Twitter handle?'),
    );

export async function execute(interaction: CommandInteraction<CacheType>, user: User) {
    const status = interaction.options.get('status');
    const github = interaction.options.getString('github');
    const linkedin = interaction.options.getString('linkedin');
    const twitter = interaction.options.getString('twitter');

    const guild = await client.guilds.fetch(CONSTANTS.GUILD_ID);
    const member = await guild.members.fetch(user.id);

    if (!member.roles.cache.has(CONSTANTS.MEMBER_ROLE_ID)) {
        await member.roles.add(CONSTANTS.MEMBER_ROLE_ID);
        await interaction.reply({ content: 'Welcome to the server!', ephemeral: true });
    }

    await interaction.reply({ content: `Thank you for another intro!`, ephemeral: true });
}
