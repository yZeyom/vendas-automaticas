const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType, ModalBuilder, TextInputBuilder } = require("discord.js");
const {bot,carrinho,db,logs,pn,rd,vnd, token} = require("../../database/index"); 

module.exports = {
    name:"setdono",
    description:"[🛠 Developer Only]",
    type: ApplicationCommandType.ChatInput,
    options:[
        {
            name:"user",
            description:"User",
            type: ApplicationCommandOptionType.User,
            required:true,
        }
    ],
    run: async(client, interaction) => {
        if(interaction.user.id !== token.get(`owner`)) return interaction.reply({content:"🔍 | Somente o dono do bot pode usar esse comando!", ephemeral:true});
        const user = interaction.options.getUser("user");
        const modal = new ModalBuilder()
        .setCustomId(`${user.id}_transferpussy`)
        .setTitle("⚠ | Transferir Posse");

        const text = new TextInputBuilder()
        .setCustomId("text")
        .setStyle(1)
        .setLabel('digite "sim" para confirmar:')
        .setPlaceholder(`Transferindo posse para ${user.username}`)
        .setRequired(true)
        .setMaxLength(3)
        .setMinLength(3);

        modal.addComponents(new ActionRowBuilder().addComponents(text));

        return interaction.showModal(modal);
    }}