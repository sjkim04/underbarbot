const { Events } = require('discord.js');
const { guildId } = require('../config.json');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		const guild = client.guilds.cache.get(guildId);
		guild.members.fetch();

		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};