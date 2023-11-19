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
				.setRequired(false)
				.addChoices(
					{ name: 'Season 2', value: 's2' },
					{ name: 'Season 1', value: 's1' },
				),
		),
	execute(interaction: UpdatedInteraction) {
		const option = interaction.options.getString('season', false) ?? 's2';
		const rootJsonObject = JSON.parse(fs.readFileSync('./ppap.json', 'utf-8'));
		const jsonObject = rootJsonObject[option];
		
		interaction.reply(`${option.toUpperCase()}의 ppap 성적:\nPen: ${jsonObject.pen}\nPineapple: ${jsonObject.pineapple}\nApple: ${jsonObject.apple}\nPPAP: ${jsonObject.ppap}\n\n확률: 1/${Math.round(((jsonObject.pen + jsonObject.pineapple + jsonObject.apple + jsonObject.ppap) / jsonObject.ppap) * 1000) / 1000}`);
	},
};