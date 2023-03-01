const { SlashCommandBuilder, embedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('underbar')
		.setDescription('언더바게임에 관한 명령어입니다.')
		.addSubcommand(subcommand =>
			subcommand
				.setName('ping')
				.setDescription('언더바를 핑합니다.'),
		),
	/** .addSubcommand(subcommand =>
			subcommand
				.setName('qualifiers')
				.setDescription('예선 곡 정보를 확인합니다.'),
		), */
	execute(interaction) {
		if (interaction.options.getSubcommand() === 'ping') {
			interaction.reply({ content: '<@359113390469283842>', allowedMentions: { users: [] } });
		}
		else if (interaction.options.getSubcommand() === 'qualifiers') {
			console.log('test');
		}
	},
};