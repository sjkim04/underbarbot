const { SlashCommandBuilder, Client, GatewayIntentBits } = require('discord.js');
const { reloadCommands } = require('../index');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('reload')
		.setDescription('Reloads commands'),
	async execute(interaction) {
		const client = new Client({ intents: [GatewayIntentBits.Guilds] });
		const owner = (await client.application?.fetch())?.owner;

		if (interaction.user.id === owner.id) {
			await interaction.reply({ content: 'Reloading commands...', ephemeral: true });
			await reloadCommands();
			interaction.editReply('Reloaded all commands.');
		}
		else {
			interaction.reply({ content: 'You do not have permission to reload!', ephemeral: true });
		}
	},
};
