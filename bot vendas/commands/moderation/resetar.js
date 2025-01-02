const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType, ModalBuilder, TextInputBuilder, ChannelType, Embed} = require("discord.js");
const {bot,carrinho,db,logs,pn,rd,vnd, token , personalizar, perm} = require("../../database/index");
const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
    name: "resetar",
    description: "[🛠|💰 Vendas Moderação] Resete as vendas, o rank, cupons, etc.",
    type: ApplicationCommandType.ChatInput,
    run: async (client, interaction) => { 

        if(!await perm.get(`${interaction.user.id}`)) return await interaction.reply({embeds:[ new EmbedBuilder().setDescription(`⚠️ | Você não possui permissão para utilizar este comando!`).setColor("Red")],ephemeral:true});
        const userid = interaction.user.id

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle(`${interaction.client.user.username} | Sistema de Vendas`)
                .setDescription("Clique no que você deseja resetar:")
                .setColor(bot.get("cor"))
            ],
            components: [
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId(`${userid}_estaticandperfil`)
                    .setLabel("Estatísticas e Perfil")
                    .setEmoji("<:config_cloud:1213558269633892352>")
                    .setStyle(2),
                    new ButtonBuilder()
                    .setCustomId(`${userid}_rankproduto`)
                    .setLabel("Rank Produtos")
                    .setEmoji("<:config_cloud:1213558269633892352>")
                    .setStyle(2),
                    new ButtonBuilder()
                    .setCustomId(`${userid}_cupons`)
                    .setLabel("Cupons")
                    .setEmoji("<:config_cloud:1213558269633892352>")
                    .setStyle(2),
                    new ButtonBuilder()
                    .setCustomId(`${userid}_giftcardsreset`)
                    .setLabel("GiftCards")
                    .setEmoji("<:config_cloud:1213558269633892352>")
                    .setStyle(2),

                ),

                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId(`${userid}_keysreset`)
                    .setLabel("Keys")
                    .setEmoji("<:config_cloud:1213558269633892352>")
                    .setStyle(2),
                    new ButtonBuilder()
                    .setCustomId(`${userid}_dropsreset`)
                    .setLabel("Drops")
                    .setEmoji("<:config_cloud:1213558269633892352>")
                    .setStyle(2),
                    new ButtonBuilder()
                    .setCustomId(`${userid}_produtosallreset`)
                    .setLabel("Produtos")
                    .setEmoji("<:config_cloud:1213558269633892352>")
                    .setStyle(2),
                    new ButtonBuilder()
                    .setCustomId(`${userid}_paineisallreset`)
                    .setLabel("Paineis")
                    .setEmoji("<:config_cloud:1213558269633892352>")
                    .setStyle(2),
                )
            ]
        })
    }
}