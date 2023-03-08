const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const axios = require('axios');
const config = require('../config.json');
const fs = require('node:fs');

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
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('r2_debuffsend')
				.setDescription('2라운드에서 줄 디버프를 전송합니다.')
				.addStringOption(option => option.setName('debuff').setDescription('Debuff to give').setRequired(true)),
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
		else if (interaction.options.getSubcommand() === 'r2_debuffsend') {
			// eslint-disable-next-line no-unused-vars
			const jsonObject = JSON.parse(fs.readFileSync('./botdata/r2.json'));
			if (!jsonObject[interaction.user.id]) {
				interaction.reply({ content: 'No Perms', ephemeral: true });
				return;
			}

			const opuser = await interaction.client.users.fetch(jsonObject[interaction.user.id]['op']);
			const debuff = interaction.options.getString('debuff');

			const row = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId('r2_yes')
						.setLabel('Yes')
						.setStyle(ButtonStyle.Success),
					new ButtonBuilder()
						.setCustomId('r2_no')
						.setLabel('No')
						.setStyle(ButtonStyle.Danger),
				);

			const msg = await interaction.reply({ content: `${opuser}에게 **${debuff}** 디버프를 주시겠습니까?`, ephemeral: true, components: [row], fetchReply: true });

			let buttonInteraction;

			try {
				buttonInteraction = await msg.awaitMessageComponent({
					time: 1000 * 60,
				});
			}
			catch (e) {
				await interaction.editReply({ content: '시간이 초과되었습니다.', components: [] });
			}

			row.components[0].setDisabled(true);
			row.components[1].setDisabled(true);

			interaction.editReply({ components: [row] });

			if (buttonInteraction.customId === 'r2_yes') {
				jsonObject[interaction.user.id]['debuff'] = debuff;
				await fs.writeFileSync('./botdata/r2.json', JSON.stringify(jsonObject));
				buttonInteraction.reply({ content: '디버프가 전송되었습니다.', ephemeral: true });
			}
			else if (buttonInteraction.customId === 'r2_no') {
				buttonInteraction.reply({ content: '디버프 전송이 최소되었습니다.', ephemeral: true });
			}
		}
	},
};