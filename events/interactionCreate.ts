import { Collection, Interaction } from 'discord.js';
import { ClientWithCommands, CommandType } from '../types';

export const name = 'interactionCreate';

export const execute = async (interaction: Interaction) => {
    if (!interaction.isCommand()) return;

    const command: CommandType = ((interaction.client as ClientWithCommands).commands as Collection<string, any>).get(
        interaction.commandName,
    );

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
};
