const { Events } = require('discord.js');
const Sentry = require('@sentry/node');
require('@sentry/tracing');
const { sentryURL } = require('../config.json');

Sentry.init({
	dsn: sentryURL,
	tracesSampleRate: 0,
});

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		interaction.client.jejudo.handleInteraction(interaction);

		if (interaction.isButton && interaction.customId !== undefined) {
			console.log(interaction.customId.slice(0, 5));
			if (interaction.customId.slice(0, 6) === 'r2conf') {
				const r2confhandler = require('../handlers/r2confhandler');
				try {
					await r2confhandler.execute(interaction);
				}
				catch (error) {
					console.error(`Error executing ${interaction.commandName}`);
					console.error(error);
					Sentry.captureException(error);
				}
			}
		}

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