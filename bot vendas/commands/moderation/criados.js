const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType, ModalBuilder, TextInputBuilder } = require("discord.js");
const {bot,carrinho,db,logs,pn,rd,vnd, token , personalizar, perm} = require("../../database/index");


module.exports = {
    name:"criados",
    description:"[🛠|💰 Vendas Moderação] Veja todos os produtos, cupons, keys, etc. Cadastrados no bot",
    type: ApplicationCommandType.ChatInput,
    run:async(client, interaction) => {
        if(!await perm.get(`${interaction.user.id}`)) return await interaction.reply({embeds:[ new EmbedBuilder().setDescription(`⚠️ | Você não possui permissão para utilizar este comando!`).setColor("Red")],ephemeral:true});
        const userid = interaction.user.id
        interaction.reply({
            embeds:[
                new EmbedBuilder()
                .setTitle(`${interaction.guild.name} | Sistema de Vendas`)
                .setColor(await bot.get("cor"))
                .setDescription(`Clique no que você deseja ver:`)
            ],
            components:[
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId(`${userid}_produtosall`)
                    .setLabel("Produtos")
                    .setEmoji("<:config_cloud:1213558269633892352>")
                    .setStyle(2),
                    new ButtonBuilder()
                    .setCustomId(`${userid}_cuponsall`)
                    .setLabel("Cupons")
                    .setEmoji("<:config_cloud:1213558269633892352>")
                    .setStyle(2),
                    new ButtonBuilder()
                    .setCustomId(`${userid}_keysall`)
                    .setLabel("Keys")
                    .setEmoji("<:config_cloud:1213558269633892352>")
                    .setStyle(2),
                    new ButtonBuilder()
                    .setCustomId(`${userid}_giftcardall`)
                    .setLabel("GiftCards")
                    .setEmoji("<:config_cloud:1213558269633892352>")
                    .setStyle(2),
                ),
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId(`${userid}_dropsall`)
                    .setLabel("Drops")
                    .setEmoji("<:config_cloud:1213558269633892352>")
                    .setStyle(2)
                ),
            ]
        })
    }}