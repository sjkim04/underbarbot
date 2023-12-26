import { SlashCommandBuilder } from 'discord.js';
import { UpdatedInteraction } from '..';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('servercount')
        .setDescription('봇이 들어가 있는 서버의 수를 확인합니다.'),
    execute(interaction: UpdatedInteraction) {
        interaction.reply('1. 왜 물어요 당연한 것을');
    },
};
