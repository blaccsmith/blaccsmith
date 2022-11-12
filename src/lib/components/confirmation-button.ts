import { MessageActionRow } from 'discord.js';

export const ConfirmationButton = [
    {
        type: 'ACTION_ROW',
        components: [
            {
                type: 'BUTTON',
                style: 'SUCCESS',
                customId: 'confirm',
                label: 'Confirm',
            },
            {
                type: 'BUTTON',
                style: 'DANGER',
                customId: 'cancel',
                label: 'Cancel',
            },
        ],
    },
] as MessageActionRow[];
