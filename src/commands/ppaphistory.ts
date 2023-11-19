import { SlashCommandBuilder } from 'discord.js';
import fs from 'node:fs';
import { UpdatedInteraction } from '..';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ppaphistory')
		.setDescription('historyappleapplepen')
		.addStringOption(option =>
			option
				.setName('season')
				.setDescription('whatseasonapplepen')
				.addChoices(
					{ name: 'Season 2', value: 's2' },
					{ name: 'Season 1', value: 's1' },
				)
				.setRequired(false),
		),
	execute(interaction: UpdatedInteraction) {
		const option = interaction.options.getString('season', false);
		const rootJsonObject = JSON.parse(fs.readFileSync('./ppap.json', 'utf-8'));
		const jsonObject = rootJsonObject[option ?? 's2'];
		
		interaction.reply(`Pen: ${jsonObject.pen}\nPineapple: ${jsonObject.pineapple}\nApple: ${jsonObject.apple}\nPPAP: ${jsonObject.ppap}\n\n확률: ${Math.round(((jsonObject.pen + jsonObject.pineapple + jsonObject.apple + jsonObject.ppap) / jsonObject.ppap) * 1000) / 1000}`);
	},
};