const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
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
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('r2_debuffcheck')
				.setDescription('2라운드 디버프를 확인합니다. (관리자 전용)'),
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
				jsonObject[interaction.user.id]['confirmed'] = false;
				await fs.writeFileSync('./botdata/r2.json', JSON.stringify(jsonObject));
				buttonInteraction.reply({ content: '디버프가 전송되었습니다.', ephemeral: true });

				const confchannel = interaction.client.channels.cache.get('1083010848034922616');
				const confrow = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId(`r2conf_y_${interaction.user.id}`)
							.setLabel('Yes')
							.setStyle(ButtonStyle.Success),
						new ButtonBuilder()
							.setCustomId(`r2conf_n_${interaction.user.id}`)
							.setLabel('No')
							.setStyle(ButtonStyle.Danger),
					);

				await confchannel.send({ content: `새로운 디버프가 전송되었습니다!\n\n디버프: **${debuff}**\n유저: ${interaction.user} => ${opuser}`, components: [confrow] });
			}
			else if (buttonInteraction.customId === 'r2_no') {
				buttonInteraction.reply({ content: '디버프 전송이 최소되었습니다.', ephemeral: true });
			}
		}
		else if (interaction.options.getSubcommand() === 'r2_debuffcheck') {
			if (!interaction.inGuild()) {
				interaction.reply({ content: 'Please run this in a guild!', ephemeral: true });
				return;
			}
			if (interaction.member.roles.cache.some(role => role.id === '1079041613025783929')) {
				await interaction.deferReply();
				const jsonObject = JSON.parse(fs.readFileSync('./botdata/r2.json'));

				const fields = [];
				const fields2 = [];
				const fields3 = [];

				for (let i = 0; i < Object.keys(jsonObject).length; i++) {
					const me = await interaction.client.users.fetch(Object.keys(jsonObject)[i]);
					const op = await interaction.client.users.fetch(jsonObject[Object.keys(jsonObject)[i]]['op']);
					if (i < 24) {
						fields[i] = {
							name: `${me.tag} => ${op.tag}`,
							value: `${jsonObject[Object.keys(jsonObject)[i]]['debuff']}`,
						};
					}
					else if (i < 49) {
						fields2[i] = {
							name: `${me.tag} => ${op.tag}`,
							value: `${jsonObject[Object.keys(jsonObject)[i]]['debuff']}`,
						};
					}
					else {
						fields3[i] = {
							name: `${me.tag} => ${op.tag}`,
							value: `${jsonObject[Object.keys(jsonObject)[i]]['debuff']}`,
						};
					}

				}

				const embed = new EmbedBuilder()
					.setTitle('2라운드 디버프 목록')
					.addFields(fields);
				const embed2 = new EmbedBuilder()
					.setTitle('2라운드 디버프 목록 (시즌2)')
					.addFields(fields2);
				const embed3 = new EmbedBuilder()
					.setTitle('2라운드 디버프 목록 (시즌3)')
					.addFields(fields3);

				interaction.editReply({ embeds: [embed, embed2, embed3] });
			}
		}
	},
};