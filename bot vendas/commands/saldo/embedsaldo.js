const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType, ModalBuilder, TextInputBuilder, ChannelType } = require("discord.js");
const {bot,carrinho,db,logs,pn,rd,vnd, token , personalizar, perm} = require("../../database/index");


module.exports = {
    name:"embedsaldo",
    description:"[🛠|💰 Vendas Moderação] Setar Painel saldo.",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "canal",
            description: "Coloque o Canal de Duvidas",
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [
                ChannelType.GuildText,
            ],
            required: false
        }
    ],
    run:async(client, interaction) => {
        if(!await perm.get(`${interaction.user.id}`)) return await interaction.reply({embeds:[ new EmbedBuilder().setDescription(`⚠️ | Você não possui permissão para utilizar este comando!`).setColor("Red")],ephemeral:true});
        const channel = interaction.options.getChannel("canal") || "sem";
        const id = channel.id ?? "sem"
        const modal = new ModalBuilder()
        .setCustomId(`${id}_setpainelsaldo`)
        .setTitle("🎉 | Setar Painel de Saldo");

        const text = new TextInputBuilder()
        .setCustomId("title")
        .setStyle(1)
        .setLabel("Título:")
        .setPlaceholder("Título da Embed")
        .setRequired(true)
        .setMaxLength(200);

        const text1 = new TextInputBuilder()
        .setCustomId("desc")
        .setStyle(2)
        .setLabel("Descrição:")
        .setMaxLength(2000)
        .setPlaceholder("Descrição da Embed")
        .setRequired(true);

        const text2 = new TextInputBuilder()
        .setCustomId("content")
        .setStyle(1)
        .setLabel("content:(opcional)")
        .setRequired(false)
        .setPlaceholder("Oque ficará fora da Embed.");

        const text3 = new TextInputBuilder()
        .setStyle(1)
        .setCustomId("imagem")
        .setLabel("Imagem:(opcional)")
        .setPlaceholder("Link da Imagem.")
        .setRequired(false);

        const text4 = new TextInputBuilder()
        .setCustomId("cor")
        .setStyle(1)
        .setLabel("COR: (opcional)")
        .setRequired(false)
        .setPlaceholder("Cor da Embed.");

        modal.addComponents(new ActionRowBuilder().addComponents(text));
        modal.addComponents(new ActionRowBuilder().addComponents(text1));
        modal.addComponents(new ActionRowBuilder().addComponents(text2));
        modal.addComponents(new ActionRowBuilder().addComponents(text3));
        modal.addComponents(new ActionRowBuilder().addComponents(text4));

        return interaction.showModal(modal);
}}