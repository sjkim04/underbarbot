const { SlashCommandBuilder } = require('discord.js');
const { pen, pineapple, apple, ppap } = require('../ppap.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ppaphistory')
		.setDescription('historyappleapplepen'),
	execute(interaction) {
		interaction.reply(`Pen: ${pen}\nPineapple: ${pineapple}\nApple: ${apple}\nPPAP: ${ppap}`);
	},
};