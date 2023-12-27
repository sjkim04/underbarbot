import { UpdatedInteraction } from '..';
import fs from 'node:fs';

import {
    BaseGuildTextChannel,
    ButtonBuilder,
    CategoryChannel,
    ChannelType,
    ForumChannel,
    GuildMemberRoleManager,
    ModalBuilder,
    SlashCommandBuilder,
    TextInputBuilder,
} from 'discord.js';
//import axios from 'axios';
//import config from '../config.json';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('underbar')
        .setDescription('언더바게임에 관한 명령어입니다.')
        .addSubcommand((subcommand) =>
            subcommand.setName('ping').setDescription('언더바를 핑합니다.'),
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('debuff')
                .setDescription('디버프를 제출합니다.')
                .addStringOption((option) =>
                    option
                        .setName('debuff')
                        .setDescription('디버프를 입력하세요.')
                        .setDescriptionLocalization('en-US', 'Please enter your debuff.')
                        .setRequired(true),
                ),
        ),
    //.addSubcommand(subcommand =>
    //	subcommand
    //		.setName('qual_ppl')
    //		.setDescription('예선 채보 제출자 수를 확인합니다.'),
    //),
    async execute(interaction: UpdatedInteraction) {
        if (interaction.options.getSubcommand() === 'ping') {
            interaction.reply({
                content: '<@359113390469283842>',
                allowedMentions: { users: [] },
            });
        } else if (interaction.options.getSubcommand() === 'debuff') {
            if (interaction.member.roles instanceof GuildMemberRoleManager) {
                if (
                    !interaction.member.roles.cache.some(
                        (role) => role.id === '1189537394966413322',
                    )
                )
                    return;
            } else if (!interaction.member.roles.includes('1189537394966413322')) return;

            const debuff = interaction.options.getString('debuff', true).replaceAll('///', '\n');
            const jsonObject = JSON.parse(fs.readFileSync('./debuff.json', 'utf-8'));
            const action = jsonObject[interaction.user.id] ? '수정' : '등록';
            const oldDebuff = jsonObject[interaction.user.id] || null;
            jsonObject[interaction.user.id] = debuff;
            fs.writeFileSync('./debuff.json', JSON.stringify(jsonObject));

            const confCh = interaction.guild.channels.cache.get('1083010848034922616');
            if (confCh instanceof CategoryChannel || confCh instanceof ForumChannel) return;
            await confCh.send(
                `디버프가 ${action}되었습니다!\n\n참가자: ${interaction.user}\n${
                    action === '수정' ? `기존 디버프: ${oldDebuff}\n 수정 ` : ''
                }디버프: **${debuff}**`,
            );
            return interaction.reply({ content: `디버프가 ${action}되었습니다.`, ephemeral: true });
        }
        //else if (interaction.options.getSubcommand() === 'qual_ppl') {
        //	await interaction.deferReply();
        //	const api = axios.create({
        //		baseURL: `https://sheets.googleapis.com/v4/spreadsheets/${config.underbarAPIsheet}`,
        //		params: {
        //			key: config.GSheetsKey,
        //		},
        //	});
        //	const { data: { values } } = await api.get('values/\'예선 제출 관리\'!I3');
        //	interaction.editReply(`${values[0]}명이 언더바게임 예선에 채보를 제출했습니다.`);
        //}
    },
};
