const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ppap')
		.setDescription('ppap'),
	async execute(interaction) {
		if (getRandomInt(101) === 100) {
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
				break;
			case 1:
				interaction.reply('I have an apple');
				break;
			case 2:
				interaction.reply('I have pineapple');
				break;
			}
		}
	},
};
