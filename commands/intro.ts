import { CommandInteraction, CacheType } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

export const data = new SlashCommandBuilder()
    .setName('intro')
    .setDescription('✨ Tell us a bit about yourself!')
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

export async function execute(interaction: CommandInteraction<CacheType>) {
    const status = interaction.options.get('status');
    const github = interaction.options.getString('github');
    const linkedin = interaction.options.getString('linkedin');
    const twitter = interaction.options.getString('twitter');

    console.log({ status, github, linkedin, twitter });

    await interaction.reply({ content: 'Welcome to the server!', ephemeral: true });
}
