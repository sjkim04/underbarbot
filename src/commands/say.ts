import { ChannelType, SlashCommandBuilder } from 'discord.js';
import { UpdatedInteraction } from '..';

module.exports = {
    checkPerms: {
        condition: (interaction: UpdatedInteraction) =>
            interaction.client.jejudo.isOwner(interaction.user),
        permsName: '봇 소유자',
    },
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Say something!')
        .addChannelOption((option) =>
            option
                .setName('channel')
                .setDescription('Channel to send')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true),
        )
        .addStringOption((option) =>
            option
                .setName('message')
                .setDescription('Message to send')
                .setRequired(true),
        ),
    async execute(interaction: UpdatedInteraction) {
        await interaction.deferReply({ ephemeral: true });
        const channel = interaction.options.getChannel('channel', true, [
            ChannelType.GuildText,
        ]);
        const message = interaction.options.getString('message', true);

        await channel.send(message);
        return interaction.deleteReply();
    },
};
