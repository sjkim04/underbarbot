const { SlashCommandBuilder, Client, GatewayIntentBits, Collection } = require('discord.js');
const path = require('node:path');
const fs = require('node:fs');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('reload')
		.setDescription('Reloads commands'),
	async execute(interaction) {

		function loadCommands() {
			client.commands = new Collection();

			const commandsPath = path.join(__dirname, '/../commands');
			const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

			for (const file of commandFiles) {
				const filePath = path.join(commandsPath, file);
				const command = require(filePath);
				// Set a new item in the Collection with the key as the command name and the value as the exported module
				if ('data' in command && 'execute' in command) {
					client.commands.set(command.data.name, command);
				}
				else {
					console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
				}
			}
		}

		const client = new Client({ intents: [GatewayIntentBits.Guilds] });
		const ownerId = '503447721839951884';


		if (interaction.user.id === ownerId) {
			await interaction.reply({ content: 'Reloading commands...', ephemeral: true });
			await loadCommands();
			await interaction.editReply('Reloaded all commands.');
		}
		else {
			interaction.reply({ content: 'You do not have permission to reload!', ephemeral: true });
		}
	},
};
