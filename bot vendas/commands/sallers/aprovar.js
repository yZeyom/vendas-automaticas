const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType, ModalBuilder, TextInputBuilder, ChannelType } = require("discord.js");
const {bot,db,logs,pn,rd,vnd, token , personalizar, perm} = require("../../database/index");
const { QuickDB } = require("quick.db");
const carrinho = new QuickDB({table:"carrinho"});


module.exports = {
    name:"aprovar",
    description: "[🛠|💰 Vendas Moderação] Aprove uma compra.",
    options: [
        {
            name: "id",
            description: "Coloque o ID da compra.",
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
  run:async (client,interaction) => {
    const id = interaction.options.getString("id");
    if(!await perm.get(`${interaction.user.id}`)) return await interaction.reply({embeds:[ new EmbedBuilder().setDescription(`⚠️ | Você não possui permissão para utilizar este comando!`).setColor("Red")],ephemeral:true});
    const cart = await carrinho.get(`${id}`);
    if(!cart) return interaction.reply({content:`${personalizar.get("12")} | Não encontrei está compra em nenhum lugar.`, ephemeral:true});
    if(cart.status !== "Processando...") return interaction.reply({content:`${personalizar.get("2")} | Esté carrinho tem que está na Parte de Pagar!`, ephemeral:true});
    await carrinho.set(`${id}.status`, "aprovado");
    await carrinho.set(`${id}.pagamento`, "manual");
    interaction.reply({content:`O carrinho foi aprovado com sucesso!`, ephemeral:true});
  }}