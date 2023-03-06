const { Events } = require('discord.js');
const Sentry = require('@sentry/node');
require('@sentry/tracing');

Sentry.init({
	dsn: 'https://52721668628444329fee016665a5a865@o4504789529395200.ingest.sentry.io/4504789531492352',
	tracesSampleRate: 0,
});

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		interaction.client.jejudo.handleInteraction(interaction);

		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command && interaction.commandName !== 'jejudo') {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.execute(interaction);
		}
		catch (error) {
			console.error(`Error executing ${interaction.commandName}`);
			console.error(error);
			Sentry.captureException(error);
		}
	},
};