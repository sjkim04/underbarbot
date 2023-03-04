const ytdl = require('ytdl-core');
const { createAudioResource } = require('@discordjs/voice');

const play = (client, guildId) => {
	const queue = client.queue;

	const url = queue[guildId].playlist[0].url;
	const player = queue[guildId].player;
	const resource = createAudioResource(ytdl(url, {
		filter: 'audioonly',
		quality: 'highestaudio',
	}));
	player.play(resource);
};

const getNextResource = (client, guildId) => {
	const queue = client.queue;
	if (queue[guildId]) {
		queue[guildId].playlist.shift();
		if (queue[guildId].playlist.length === 0) {
			delete queue[guildId];
		}
		else {
			play(guildId);
		}
	}
};

module.exports = { play, getNextResource };