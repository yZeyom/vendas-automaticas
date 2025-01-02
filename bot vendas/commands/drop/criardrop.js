const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType, ModalBuilder, TextInputBuilder } = require("discord.js");
const {bot,carrinho,db,logs,pn,rd,vnd, token , personalizar, perm} = require("../../database/index");


module.exports = {
    name:"criardrop",
    description:"[🛠|💰 Vendas Moderação] Crie um Drop.",
    type: ApplicationCommandType.ChatInput,
    run:async(client, interaction) => {
        if(!await perm.get(`${interaction.user.id}`)) return await interaction.reply({embeds:[ new EmbedBuilder().setDescription(`⚠️ | Você não possui permissão para utilizar este comando!`).setColor("Red")],ephemeral:true});
        const modal = new ModalBuilder()
        .setCustomId(`criardrop`)
        .setTitle("🎉 | Criar um Drop"); 

        const text = new TextInputBuilder()
        .setCustomId(`text`)
        .setStyle(1)
        .setLabel("código:")
        .setRequired(true)
        .setPlaceholder("Insira o Código deste drop.");

        const text1 = new TextInputBuilder()
        .setCustomId("text1")
        .setStyle(2)
        .setLabel("O QUE SERÁ ENTREGUE?")
        .setPlaceholder("Coloque aqui o que o usuário irá receber quando resgatar este drop.");

        modal.addComponents(new ActionRowBuilder().addComponents(text));
        modal.addComponents(new ActionRowBuilder().addComponents(text1));

        return interaction.showModal(modal);
    }}