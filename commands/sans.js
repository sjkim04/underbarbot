const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('sans')
		.setDescription('welp.'),
	execute(interaction) {
		const locales = {
			en: 'wanna have a bad time?',
			ko: '끔찍한 시간을 보내고 싶어?',
		};
		interaction.reply({ content: locales[interaction.locale] ?? locales['en'] });
	},
};