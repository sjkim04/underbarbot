const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ppaphistory')
		.setDescription('historyappleapplepen'),
	execute(interaction) {
		const jsonObject = JSON.parse(fs.readFileSync('./ppap.json'));
		interaction.reply(`Pen: ${jsonObject.pen}\nPineapple: ${jsonObject.pineapple}\nApple: ${jsonObject.apple}\nPPAP: ${jsonObject.ppap}\n\n확률: ${Math.round(((jsonObject.pen + jsonObject.pineapple + jsonObject.apple + jsonObject.ppap) / jsonObject.ppap) * 1000) / 1000}`);
	},
};