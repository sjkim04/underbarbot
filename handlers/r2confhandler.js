const fs = require('node:fs');
const { ActionRowBuilder } = require('discord.js');

module.exports = {
	async execute(interaction) {
		const row = ActionRowBuilder.from(interaction.message.components[0]);

		console.log(row);

		row.components[0].setDisabled(true);
		row.components[1].setDisabled(true);
		interaction.update({ components: [row] });

		if (interaction.customId.slice(7, 8) === 'y') {
			interaction.message.react('✅');

			const userId = interaction.customId.slice(9);
			const sendUser = await interaction.client.users.fetch(userId);

			const jsonObject = JSON.parse(fs.readFileSync('./botdata/r2.json'));
			const receiveUser = await interaction.client.users.fetch(jsonObject[userId]['op']);

			jsonObject[userId]['confirmed'] = true;
			jsonObject[receiveUser.id]['rDebuff'] = jsonObject[userId]['debuff'];

			await fs.writeFileSync('./botdata/r2.json', JSON.stringify(jsonObject));

			const DMChannel = await receiveUser.createDM();
			DMChannel.send(`${sendUser}에게서 디버프가 날아왔습니다!\nYou got a debuff from ${sendUser}!\n\n**${jsonObject[userId]['debuff']}**`);
		}
		else if (interaction.customId.slice(7, 8) === 'n') {
			interaction.message.react('❌');
			const userId = interaction.customId.slice(9);
			const sendUser = await interaction.client.users.fetch(userId);

			const jsonObject = JSON.parse(fs.readFileSync('./botdata/r2.json'));

			jsonObject[userId]['confirmed'] = false;
			jsonObject[userId]['debuff'] = '';

			const DMChannel = await sendUser.createDM();
			await DMChannel.send(`${sendUser}님의 디버프가 거부되었습니다. </underbar r2_debuff:1083012358336680053> 명령어로 새로운 디버프를 제출해 주세요.\nYour debuff has been rejected. Please send another debuff with the </underbar r2_debuff:1083012358336680053> command.`);

		}
	},
};