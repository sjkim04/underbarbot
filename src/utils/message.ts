import {
    ComponentType,
    StringSelectMenuBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    EmbedBuilder,
    ChatInputCommandInteraction,
} from 'discord.js';

export const disableComponents = (components, excl) => {
    const rows: ActionRowBuilder[] = [];
    if (!Array.isArray(excl)) excl = [excl];

    for (const oldRow of components) {
        const row = new ActionRowBuilder().addComponents(
            oldRow.components.map((component) => {
                if (
                    excl.some((element) =>
                        component.data.custom_id.startsWith(element),
                    )
                )
                    return component;

                let disabledComp;
                switch (component.data.type) {
                    case ComponentType.Button:
                        disabledComp = ButtonBuilder.from(component);
                        break;
                    case ComponentType.StringSelect:
                        disabledComp = StringSelectMenuBuilder.from(component);
                        break;
                }

                disabledComp.setDisabled(true);
                return disabledComp;
            }),
        );

        rows.push(row);
    }

    return rows;
};

export const createNoPermsMessage = (
    interaction: ChatInputCommandInteraction,
    permsName: string,
) => {
    const embed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle('권한 없음')
        .setDescription(
            `:x: </${interaction.commandName}:${interaction.commandId}>를 실행할 권한이 없어요!\n이는 ${permsName} 권한을 필요로 합니다.`,
        )
        .setTimestamp();
    return embed;
};

export const permsChecker = async (
    condition: Function,
    permsName: string,
    guildOnly: true,
    interaction: ChatInputCommandInteraction,
) => {
    if (guildOnly && !interaction.inGuild()) {
        interaction = interaction as ChatInputCommandInteraction;
        const embed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle('서버 전용')
            .setDescription(
                `:x: </${interaction.commandName}:${interaction.commandId}> 커맨드는 DM에선 실행할 수 없어요!\n언더바게임 서버에서 다시 실행해 주세요.`,
            )
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
        return false;
    }
    const results = await condition(interaction);

    if (!results && this) {
        const embed = createNoPermsMessage(interaction, permsName);

        await interaction.reply({ embeds: [embed] });
        return false;
    }

    return true;
};
