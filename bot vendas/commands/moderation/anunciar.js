const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType, ModalBuilder, TextInputBuilder } = require("discord.js");
const {bot,carrinho,db,logs,pn,rd,vnd, token , personalizar, perm} = require("../../database/index");


module.exports = {
    name:"anunciar",
    description:"[🛠| Moderação] Envie um anuncio.",
    type: ApplicationCommandType.ChatInput,
    run:async(client, interaction) => {
        if(!await perm.get(`${interaction.user.id}`)) return await interaction.reply({embeds:[ new EmbedBuilder().setDescription(`⚠️ | Você não possui permissão para utilizar este comando!`).setColor("Red")],ephemeral:true});
        const modal = new ModalBuilder()
        .setCustomId("anuncarmodal")
        .setTitle("🎉 | Anunciar"); 

        const title = new TextInputBuilder()
        .setCustomId("title")
        .setLabel("Título:")
        .setPlaceholder("Título do Ánuncio.")
        .setStyle(1)
        .setRequired(true)
        .setMaxLength(2000);

        const desc = new TextInputBuilder()
        .setCustomId("desc")
        .setPlaceholder("Descrição do Ánuncio.")
        .setLabel("Descrição: ")
        .setStyle(2)
        .setRequired(true)
        .setMaxLength(2000);

        const content = new TextInputBuilder()
        .setCustomId("content")
        .setLabel("Content: (OPCIONAL)")
        .setStyle(1)
        .setRequired(false)
        .setPlaceholder("Oque ficará fora da Embed.");

        const image = new TextInputBuilder()
        .setCustomId("image")
        .setLabel("Imagem: (opcional)")
        .setStyle(1)
        .setRequired(false)
        .setPlaceholder("Link da Imagem para o Ánuncio.");

        const cor = new TextInputBuilder()
        .setCustomId("cor")
        .setPlaceholder("Cor da Embed.")
        .setLabel("Cor: (opcional)")
        .setStyle(1)
        .setRequired(false);
        
        modal.addComponents(new ActionRowBuilder().addComponents(title));
        modal.addComponents(new ActionRowBuilder().addComponents(desc));
        modal.addComponents(new ActionRowBuilder().addComponents(content));
        modal.addComponents(new ActionRowBuilder().addComponents(image));
        modal.addComponents(new ActionRowBuilder().addComponents(cor));

        return interaction.showModal(modal);
        
}}