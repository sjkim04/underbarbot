const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		const guild = client.guilds.cache.get('1079040702798893127');
		guild.members.fetch();

		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};