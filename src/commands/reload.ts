import { SlashCommandBuilder } from 'discord.js';
import path from 'node:path';
import fs from 'node:fs';
import { UpdatedClient, UpdatedInteraction } from '..';

module.exports = {
    checkPerms: {
        condition: (interaction) =>
            interaction.client.jejudo.isOwner(interaction.user),
        permsName: '봇 소유자',
    },
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('명령어를 다시 불러옵니다.'),
    async execute(interaction: UpdatedInteraction) {
        function loadCommands() {
            const commandsPath = path.join(__dirname, '/../commands');
            const commandFiles = fs
                .readdirSync(commandsPath)
                .filter((file) => file.endsWith('.js'));

            for (const file of commandFiles) {
                const filePath = path.join(commandsPath, file);
                delete require.cache[require.resolve(filePath)];
                const command = require(filePath);
                // Set a new item in the Collection with the key as the command name and the value as the exported module
                if ('data' in command && 'execute' in command) {
                    client.commands.delete(command.data.name);
                    client.commands.set(command.data.name, command);
                } else {
                    console.log(
                        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
                    );
                }
            }
        }

        const client: UpdatedClient = interaction.client;
        if (client.jejudo.isOwner(interaction.user)) {
            await interaction.reply({
                content: 'Reloading commands...',
                ephemeral: true,
            });
            await loadCommands();
            await interaction.editReply('Reloaded all commands.');
        } else {
            interaction.reply({
                content: 'You do not have permission to reload!',
                ephemeral: true,
            });
        }
    },
};
