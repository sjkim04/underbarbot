import { Events } from 'discord.js';
import { permsChecker } from '../utils/message';

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        interaction.client.jejudo.handleInteraction(interaction);

        if (interaction.isAutocomplete()) {
            const command = interaction.client.commands.get(
                interaction.commandName,
            );
            if (command) {
                if ('autocomplete' in command) {
                    try {
                        command.autocomplete(interaction);
                    } catch (error) {
                        console.error(
                            `Error handling autocomplete for ${interaction.commandName}`,
                        );
                        console.error(error);
                    }
                }
            }
        }

        if (interaction.isStringSelectMenu()) {
            const name = interaction.customId.split('_')[0];
            const handler = interaction.client.selectHandlers.get(name);
            if (handler) {
                if ('checkPerms' in handler) {
                    const check = await permsChecker(
                        handler.checkPerms.condition,
                        handler.checkPerms.permsName,
                        handler.checkPerms.guildOnly,
                        interaction,
                    );
                    if (check) {
                        try {
                            handler.execute(interaction);
                        } catch (error) {
                            console.error(`Error handling ${name}`);
                            console.error(error);
                        }
                    }
                } else {
                    try {
                        handler.execute(interaction);
                    } catch (error) {
                        console.error(`Error handling ${name}`);
                        console.error(error);
                    }
                }
            }
        }

        if (interaction.isButton()) {
            const name = interaction.customId.split('_')[0];
            const handler = interaction.client.buttonHandlers.get(name);
            if (handler) {
                if ('checkPerms' in handler) {
                    const check = await permsChecker(
                        handler.checkPerms.condition,
                        handler.checkPerms.permsName,
                        handler.checkPerms.guildOnly,
                        interaction,
                    );
                    if (check) {
                        try {
                            handler.execute(interaction);
                        } catch (error) {
                            console.error(`Error handling ${name}`);
                            console.error(error);
                        }
                    }
                } else {
                    try {
                        handler.execute(interaction);
                    } catch (error) {
                        console.error(`Error handling ${name}`);
                        console.error(error);
                    }
                }
            }
        }

        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(
                interaction.commandName,
            );

            if (interaction.commandName === 'j') return;
            if (!command) {
                console.error(
                    `No command matching ${interaction.commandName} was found.`,
                );
                return;
            }

            if (command.checkPerms) {
                const check = await permsChecker(
                    command.checkPerms.condition,
                    command.checkPerms.permsName,
                    command.checkPerms.guildOnly,
                    interaction,
                );
                if (check) {
                    try {
                        command.execute(interaction);
                    } catch (error) {
                        console.error(
                            `Error executing ${interaction.commandName}`,
                        );
                        console.error(error);
                    }
                }
            } else {
                try {
                    command.execute(interaction);
                } catch (error) {
                    console.error(`Error executing ${interaction.commandName}`);
                    console.error(error);
                }
            }
        }
    },
};
