import { Attachment, AttachmentBuilder, SlashCommandBuilder } from 'discord.js';
const wait = require('node:timers/promises').setTimeout;
import fs from 'node:fs';
import { UpdatedInteraction } from '..';

function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}

module.exports = {
    data: new SlashCommandBuilder().setName('ppap').setDescription('ppap'),
    async execute(interaction: UpdatedInteraction) {
        const jsonObject = JSON.parse(fs.readFileSync('./ppap.json', 'utf-8'));

        if (getRandomInt(101) === 100) {
            if (getRandomInt(3) === 0) {
                jsonObject.s2.ppapsp = jsonObject.s2.ppapsp + 1;

                const gif = new AttachmentBuilder('./assets/ppap.gif');
                const png = new AttachmentBuilder('./assets/ppap.png');
                const msg = await interaction.reply({ files: [gif] });
                await wait(3620);
                await msg.edit({ files: [png] });
            } else {
                jsonObject.s2.ppap = jsonObject.s2.ppap + 1;
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
        } else {
            switch (getRandomInt(3)) {
                case 0:
                    interaction.reply('I have a pen');
                    jsonObject.s2.pen = jsonObject.s2.pen + 1;
                    break;
                case 1:
                    interaction.reply('I have an apple');
                    jsonObject.s2.apple = jsonObject.s2.apple + 1;
                    break;
                case 2:
                    interaction.reply('I have pineapple');
                    jsonObject.s2.pineapple = jsonObject.s2.pineapple + 1;
                    break;
            }
        }
        fs.writeFileSync('./ppap.json', JSON.stringify(jsonObject));
    },
};
