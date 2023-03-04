const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, AudioPlayerStatus } = require('@discordjs/voice');
const { play, getNextResource } = require('../musicQueue');
const ytsr = require('ytsr');
const ytdl = require('ytdl-core');

const embed = {
	color: 0x426cf5,
	author: {
		name: '',
		icon_url: '',
	},
	title: '🎶',
	thumbnail: {
		url: '',
	},
	fields: [
		{
			name: '재생 시간',
			value: '',
			inline: true,
		},
		{
			name: '조회수',
			value: '',
			inline: true,
		},
		{
			name: 'YouTube',
			value: '',
			inline: true,
		},
	],
	timestamp: new Date().toISOString(),
	footer: {
		text: '',
		icon_url: '',
	},
};

async function search(query, limit = 1) {
	const filter = await ytsr.getFilters(query);
	const result = await ytsr(filter.get('Type').get('Video').url, {
		limit,
	});

	return result.items[0];
}

function secondsToMinutesAndSeconds(seconds) {
	const minutes = Math.floor(seconds / 60);
	const realSeconds = (seconds % 60).toFixed(0);
	return minutes + ':' + (realSeconds < 10 ? '0' : '') + realSeconds;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('music')
		.setDescription('음악 관련 커맨드')
		.addSubcommand(subcommand =>
			subcommand
				.setName('play')
				.setDescription('Play')
				.addStringOption(option => option.setName('query').setDescription('URL or Search').setRequired(true)),
		),
	async execute(interaction) {
		if (interaction.options.getSubcommand() === 'play') {
			const query = interaction.options.getString('query');

			const queue = interaction.client.queue;
			const client = interaction.client.user;
			const user = interaction.member.user;

			if (!interaction.member.voice.channelId) {
				interaction.reply('음성 채널에 먼저 참가해 주세요!');
				return false;
			}

			let url;

			try {
				const videoID = ytdl.getVideoID(search);
				const videoInfo = await ytdl.getInfo(videoID);

				url = `https://youtu.be/${videoInfo.videoDetails.videoId}`;
			}
			catch (e) {
				const result = await search(query);
				console.log(result);
				if (!result) return interaction.editReply('음악을 찾을 수 없었습니다.');
				url = result.url;
			}

			const vidInfoSub = await ytdl.getInfo(url);
			const videoInfo = vidInfoSub.videoDetails;

			embed.author.name = client.username;
			embed.author.icon_url = `https://cdn.discordapp.com/avatars/${client.id}/${client.avatar}.webp`;
			embed.title = videoInfo.title;
			embed.fields[0].value = secondsToMinutesAndSeconds(videoInfo.lengthSeconds);
			embed.fields[1].value = `${videoInfo.viewCount}회`;
			embed.fields[2].value = `[링크](${videoInfo.url})`;
			embed.footer.text = user.username;
			embed.footer.icon_url = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp`;
			embed.thumbnail.url = `https://i.ytimg.com/vi/${videoInfo.videoId}/mqdefault.jpg`;
			interaction.channel.send({ embeds: [embed] });

			if (!queue[interaction.guild.id]) {
				const connection = joinVoiceChannel({
					channelId: interaction.member.voice.channel,
					guildId: interaction.guild.id,
					adapterCreator: interaction.guild.voiceAdapterCreator,
				});

				const player = createAudioPlayer();
				player.on('error', error => {
					console.error(error.message);
					getNextResource(client, interaction.guild.id);
				});
				player.on(AudioPlayerStatus.Idle, () => {
					getNextResource(client, interaction.guild.id);
				});
				connection.subscribe(player);

				queue[interaction.guild.id] = {
					playlist: [],
					player: player,
				};
				queue[interaction.guild.id].playlist.push({
					url: url,
					embed: embed,
				});
				play(client, interaction.guild.id);
				return true;
			}

			queue[interaction.guild.id].playlist.push({
				url: url,
				embed: embed,
			});
		}
	},
};
