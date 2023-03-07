const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('restart')
		.setDescription('Restarts the bot'),
	async execute(interaction) {
		const ownerId = '503447721839951884';

		if (interaction.user.id === ownerId) {
			await interaction.reply({ content: 'Restarting bot', ephemeral: true });
			process.exit();
		}
		else {
			interaction.reply({ content: 'You do not have permission to restart!', ephemeral: true });
		}
	},
};
