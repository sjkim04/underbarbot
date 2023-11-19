import { SlashCommandBuilder } from 'discord.js';
const wait = require('node:timers/promises').setTimeout;
import fs from 'node:fs';
import { UpdatedInteraction } from '..';

function getRandomInt(max: number) {
	return Math.floor(Math.random() * max);
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ppap')
		.setDescription('ppap'),
	async execute(interaction: UpdatedInteraction) {
		const jsonObject = JSON.parse(fs.readFileSync('./ppap.json', 'utf-8'));

		if (getRandomInt(101) === 100) {
			jsonObject.ppap = jsonObject.ppap + 1;
			await interaction.reply({ content: 'Ugh!', fetchReply: true });
			await wait(1000);
			await interaction.editReply('Pen-');
			await wait(220);
			await interaction.editReply('Pen-Pine');
			await wait(220);
			await interaction.editReply('Pen-Pinea');
			await wait(220);
			await interaction.editReply('Pen-Pineapple-');
			await wait(220);
			await interaction.editReply('Pen-Pineapple-A');
			await wait(220);
			await interaction.editReply('Pen-Pineapple-Apple-');
			await wait(220);
			await interaction.editReply('Pen-Pineapple-Apple-Pen');
			await wait(400);
			await interaction.editReply('**__Pen-Pineapple-Apple-Pen__**');
		}
		else {
			switch (getRandomInt(3)) {
			case 0:
				interaction.reply('I have a pen');
				jsonObject.pen = jsonObject.pen + 1;
				break;
			case 1:
				interaction.reply('I have an apple');
				jsonObject.apple = jsonObject.apple + 1;
				break;
			case 2:
				interaction.reply('I have pineapple');
				jsonObject.pineapple = jsonObject.pineapple + 1;
				break;
			}
		}
		console.log(jsonObject);
		fs.writeFileSync('./ppap.json', JSON.stringify(jsonObject));
	},
};
