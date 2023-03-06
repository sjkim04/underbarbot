const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const config = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('underbar')
		.setDescription('언더바게임에 관한 명령어입니다.')
		.addSubcommand(subcommand =>
			subcommand
				.setName('ping')
				.setDescription('언더바를 핑합니다.'),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('r1_ppl')
				.setDescription('1라운드 채보 제출자 수를 확인합니다.'),
		),
	async execute(interaction) {
		if (interaction.options.getSubcommand() === 'ping') {
			interaction.reply({ content: '<@359113390469283842>', allowedMentions: { users: [] } });
		}
		else if (interaction.options.getSubcommand() === 'r1_ppl') {
			await interaction.deferReply();
			const api = axios.create({
				baseURL: `https://sheets.googleapis.com/v4/spreadsheets/${config.underbarAPIsheet}`,
				params: {
					key: config.GSheetsKey,
				},
			});
			const { data: { values } } = await api.get('values/\'예선 제출 관리\'!L3');
			interaction.editReply(`${values[0]}명이 언더바게임 1라운드에 채보를 제출했습니다.`);
		}
	},
};