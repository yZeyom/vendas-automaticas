const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType, ModalBuilder, TextInputBuilder, ChannelType, Embed, ComponentType} = require("discord.js");
const {bot,carrinho,db,logs,pn,rd,vnd, token , personalizar, perm } = require("../../database/index");
const { joinVoiceChannel } = require('@discordjs/voice');
const moment = require("moment");
moment.locale("pt-br");
module.exports = {
    name: "rendimentos", 
    description:"[🛠 | 💰 Vendas Moderação] Veja os Seus Rendimentos!",
    type:ApplicationCommandType.ChatInput,
    run: async(client,interaction, message, args) => {
      if (!perm.get(`${interaction.user.id}`)) {
        interaction.reply({content:`${emoji.nao} | Você não está na lista de pessoas!`});
          return;
      }
      const db2 = rd;
      

       const embed = new EmbedBuilder()
       .setTitle(`${interaction.guild.name} | Rendimentos de vendas`)
       .setColor(bot.get("cor"))
       .setDescription("Escolha Qual opção abaixo você deseja ver o rendimento");
   
   const msg = await interaction.reply({ embeds: [embed], components:[
    new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
      .setCustomId("rendimentohoje")
      .setLabel("Hoje")
      .setStyle(2)
      .setEmoji(emoji(22)),
      new ButtonBuilder()
      .setCustomId("rendimento7dias")
      .setLabel("Nessa Semana")
      .setStyle(2)
      .setEmoji(emoji(22)),
      new ButtonBuilder()
      .setCustomId("rendimentomes")
      .setLabel("Nesse Mês")
      .setStyle(2)
      .setEmoji(emoji(22)),
      new ButtonBuilder()
      .setCustomId("rendimentototal")
      .setLabel("Todo o periodo")
      .setStyle(2)
      .setEmoji(emoji(22)),
    )
  ]  });
   
   const interação = msg.createMessageComponentCollector({
    componentType: ComponentType.Button,
 })
 const user = interaction.user

 interação.on("collect", async (interaction) => {
    if (user.id != interaction.user.id) {
      interaction.deferUpdate()
    return;
 } 
 
 const hojepedidos = db2.get(`${moment().format('L')}.pedidos`)  || 0;
 const hojerecebimentos = db2.get(`${moment().format('L')}.recebimentos`) || 0;

 var setedias = 0;
  setedias = Number(setedias) + Number(hojepedidos);
  setedias = Number(setedias) + Number(db2.get(`${moment().subtract(1, 'days').format('L')}.pedidos`) || 0);
  setedias = Number(setedias) + Number(db2.get(`${moment().subtract(2, 'days').format('L')}.pedidos`) || 0);
  setedias = Number(setedias) + Number(db2.get(`${moment().subtract(3, 'days').format('L')}.pedidos`) || 0);
  setedias = Number(setedias) + Number(db2.get(`${moment().subtract(4, 'days').format('L')}.pedidos`) || 0);
  setedias = Number(setedias) + Number(db2.get(`${moment().subtract(5, 'days').format('L')}.pedidos`) || 0);
  setedias = Number(setedias) + Number(db2.get(`${moment().subtract(6, 'days').format('L')}.pedidos`) || 0);
  setedias = Number(setedias) + Number(db2.get(`${moment().subtract(7, 'days').format('L')}.pedidos`) || 0);

 var setediasrec = 0;
  setediasrec = Number(setediasrec) + Number(hojerecebimentos);
  setediasrec = Number(setediasrec) + Number(db2.get(`${moment().subtract(1, 'days').format('L')}.recebimentos`) || 0);
  setediasrec = Number(setediasrec) + Number(db2.get(`${moment().subtract(2, 'days').format('L')}.recebimentos`) || 0);
  setediasrec = Number(setediasrec) + Number(db2.get(`${moment().subtract(3, 'days').format('L')}.recebimentos`) || 0);
  setediasrec = Number(setediasrec) + Number(db2.get(`${moment().subtract(4, 'days').format('L')}.recebimentos`) || 0);
  setediasrec = Number(setediasrec) + Number(db2.get(`${moment().subtract(5, 'days').format('L')}.recebimentos`) || 0);
  setediasrec = Number(setediasrec) + Number(db2.get(`${moment().subtract(6, 'days').format('L')}.recebimentos`) || 0);
  setediasrec = Number(setediasrec) + Number(db2.get(`${moment().subtract(7, 'days').format('L')}.recebimentos`) || 0);

 var setedias2 = 0;
  setedias2 = Number(setedias2) + Number(hojepedidos);
  setedias2 = Number(setedias2) + Number(db2.get(`${moment().subtract(1, 'days').format('L')}.pedidos`) || 0);
  setedias2 = Number(setedias2) + Number(db2.get(`${moment().subtract(2, 'days').format('L')}.pedidos`) || 0);
  setedias2 = Number(setedias2) + Number(db2.get(`${moment().subtract(3, 'days').format('L')}.pedidos`) || 0);
  setedias2 = Number(setedias2) + Number(db2.get(`${moment().subtract(4, 'days').format('L')}.pedidos`) || 0);
  setedias2 = Number(setedias2) + Number(db2.get(`${moment().subtract(5, 'days').format('L')}.pedidos`) || 0);
  setedias2 = Number(setedias2) + Number(db2.get(`${moment().subtract(6, 'days').format('L')}.pedidos`) || 0);
  setedias2 = Number(setedias2) + Number(db2.get(`${moment().subtract(7, 'days').format('L')}.pedidos`) || 0);
  setedias2 = Number(setedias2) + Number(db2.get(`${moment().subtract(8, 'days').format('L')}.pedidos`) || 0);
  setedias2 = Number(setedias2) + Number(db2.get(`${moment().subtract(9, 'days').format('L')}.pedidos`) || 0);
  setedias2 = Number(setedias2) + Number(db2.get(`${moment().subtract(10, 'days').format('L')}.pedidos`) || 0);
  setedias2 = Number(setedias2) + Number(db2.get(`${moment().subtract(11, 'days').format('L')}.pedidos`) || 0);
  setedias2 = Number(setedias2) + Number(db2.get(`${moment().subtract(12, 'days').format('L')}.pedidos`) || 0);
  setedias2 = Number(setedias2) + Number(db2.get(`${moment().subtract(13, 'days').format('L')}.pedidos`) || 0);
  setedias2 = Number(setedias2) + Number(db2.get(`${moment().subtract(14, 'days').format('L')}.pedidos`) || 0);
  setedias2 = Number(setedias2) + Number(db2.get(`${moment().subtract(15, 'days').format('L')}.pedidos`) || 0);
  setedias2 = Number(setedias2) + Number(db2.get(`${moment().subtract(16, 'days').format('L')}.pedidos`) || 0);
  setedias2 = Number(setedias2) + Number(db2.get(`${moment().subtract(17, 'days').format('L')}.pedidos`) || 0);
  setedias2 = Number(setedias2) + Number(db2.get(`${moment().subtract(18, 'days').format('L')}.pedidos`) || 0);
  setedias2 = Number(setedias2) + Number(db2.get(`${moment().subtract(19, 'days').format('L')}.pedidos`) || 0);
  setedias2 = Number(setedias2) + Number(db2.get(`${moment().subtract(20, 'days').format('L')}.pedidos`) || 0);
  setedias2 = Number(setedias2) + Number(db2.get(`${moment().subtract(21, 'days').format('L')}.pedidos`) || 0);
  setedias2 = Number(setedias2) + Number(db2.get(`${moment().subtract(22, 'days').format('L')}.pedidos`) || 0);
  setedias2 = Number(setedias2) + Number(db2.get(`${moment().subtract(23, 'days').format('L')}.pedidos`) || 0);
  setedias2 = Number(setedias2) + Number(db2.get(`${moment().subtract(24, 'days').format('L')}.pedidos`) || 0);
  setedias2 = Number(setedias2) + Number(db2.get(`${moment().subtract(25, 'days').format('L')}.pedidos`) || 0);
  setedias2 = Number(setedias2) + Number(db2.get(`${moment().subtract(26, 'days').format('L')}.pedidos`) || 0);
  setedias2 = Number(setedias2) + Number(db2.get(`${moment().subtract(27, 'days').format('L')}.pedidos`) || 0);
  setedias2 = Number(setedias2) + Number(db2.get(`${moment().subtract(28, 'days').format('L')}.pedidos`) || 0);
  setedias2 = Number(setedias2) + Number(db2.get(`${moment().subtract(29, 'days').format('L')}.pedidos`) || 0);
  setedias2 = Number(setedias2) + Number(db2.get(`${moment().subtract(30, 'days').format('L')}.pedidos`) || 0);

 var setediasrec2 = 0;
  setediasrec2 = Number(setediasrec2) + Number(hojerecebimentos);
  setediasrec2 = Number(setediasrec2) + Number(db2.get(`${moment().subtract(1, 'days').format('L')}.recebimentos`) || 0);
  setediasrec2 = Number(setediasrec2) + Number(db2.get(`${moment().subtract(2, 'days').format('L')}.recebimentos`) || 0);
  setediasrec2 = Number(setediasrec2) + Number(db2.get(`${moment().subtract(3, 'days').format('L')}.recebimentos`) || 0);
  setediasrec2 = Number(setediasrec2) + Number(db2.get(`${moment().subtract(4, 'days').format('L')}.recebimentos`) || 0);
  setediasrec2 = Number(setediasrec2) + Number(db2.get(`${moment().subtract(5, 'days').format('L')}.recebimentos`) || 0);
  setediasrec2 = Number(setediasrec2) + Number(db2.get(`${moment().subtract(6, 'days').format('L')}.recebimentos`) || 0);
  setediasrec2 = Number(setediasrec2) + Number(db2.get(`${moment().subtract(7, 'days').format('L')}.recebimentos`) || 0);
  setediasrec2 = Number(setediasrec2) + Number(db2.get(`${moment().subtract(8, 'days').format('L')}.recebimentos`) || 0);
  setediasrec2 = Number(setediasrec2) + Number(db2.get(`${moment().subtract(9, 'days').format('L')}.recebimentos`) || 0);
  setediasrec2 = Number(setediasrec2) + Number(db2.get(`${moment().subtract(10, 'days').format('L')}.recebimentos`) || 0);
  setediasrec2 = Number(setediasrec2) + Number(db2.get(`${moment().subtract(11, 'days').format('L')}.recebimentos`) || 0);
  setediasrec2 = Number(setediasrec2) + Number(db2.get(`${moment().subtract(12, 'days').format('L')}.recebimentos`) || 0);
  setediasrec2 = Number(setediasrec2) + Number(db2.get(`${moment().subtract(13, 'days').format('L')}.recebimentos`) || 0);
  setediasrec2 = Number(setediasrec2) + Number(db2.get(`${moment().subtract(14, 'days').format('L')}.recebimentos`) || 0);
  setediasrec2 = Number(setediasrec2) + Number(db2.get(`${moment().subtract(15, 'days').format('L')}.recebimentos`) || 0);
  setediasrec2 = Number(setediasrec2) + Number(db2.get(`${moment().subtract(16, 'days').format('L')}.recebimentos`) || 0);
  setediasrec2 = Number(setediasrec2) + Number(db2.get(`${moment().subtract(17, 'days').format('L')}.recebimentos`) || 0);
  setediasrec2 = Number(setediasrec2) + Number(db2.get(`${moment().subtract(18, 'days').format('L')}.recebimentos`) || 0);
  setediasrec2 = Number(setediasrec2) + Number(db2.get(`${moment().subtract(19, 'days').format('L')}.recebimentos`) || 0);
  setediasrec2 = Number(setediasrec2) + Number(db2.get(`${moment().subtract(20, 'days').format('L')}.recebimentos`) || 0);
  setediasrec2 = Number(setediasrec2) + Number(db2.get(`${moment().subtract(21, 'days').format('L')}.recebimentos`) || 0);
  setediasrec2 = Number(setediasrec2) + Number(db2.get(`${moment().subtract(22, 'days').format('L')}.recebimentos`) || 0);
  setediasrec2 = Number(setediasrec2) + Number(db2.get(`${moment().subtract(23, 'days').format('L')}.recebimentos`) || 0);
  setediasrec2 = Number(setediasrec2) + Number(db2.get(`${moment().subtract(24, 'days').format('L')}.recebimentos`) || 0);
  setediasrec2 = Number(setediasrec2) + Number(db2.get(`${moment().subtract(25, 'days').format('L')}.recebimentos`) || 0);
  setediasrec2 = Number(setediasrec2) + Number(db2.get(`${moment().subtract(26, 'days').format('L')}.recebimentos`) || 0);
  setediasrec2 = Number(setediasrec2) + Number(db2.get(`${moment().subtract(27, 'days').format('L')}.recebimentos`) || 0);
  setediasrec2 = Number(setediasrec2) + Number(db2.get(`${moment().subtract(28, 'days').format('L')}.recebimentos`) || 0);
  setediasrec2 = Number(setediasrec2) + Number(db2.get(`${moment().subtract(29, 'days').format('L')}.recebimentos`) || 0);
  setediasrec2 = Number(setediasrec2) + Number(db2.get(`${moment().subtract(30, 'days').format('L')}.recebimentos`) || 0);

  var tudo = 0;
  tudo = Number(db2.get(`gastostotal`))
 if(interaction.customId === "rendimentohoje") {
  const embed = new EmbedBuilder()
       .setTitle(`${interaction.guild.name} | Rendimentos de Hoje`)
      .addFields(
           { name: `${emoji(8)} | Hoje:`, value: `${emoji(7)} | Pedidos ${hojepedidos || "0"} \n${emoji(13)} | Recebimentos: R$${hojerecebimentos.toFixed(2) || "0"}`, inline: false },
      )
       .setColor(bot.get("cor"))
       interaction.reply({embeds:[embed],ephemeral:true})
 }

 if(interaction.customId === "rendimento7dias") {
    const embed = new EmbedBuilder()
         .setTitle(`${interaction.guild.name} | Rendimentos dessa semana`)
       .addFields(
           { name: `${emoji(8)} | Ultimos 7 dias:`, value: `${emoji(7)} | Pedidos ${setedias || "0"} \n${emoji(13)} | Recebimentos: R$${setediasrec.toFixed(2) || "0"}`, inline: false },
       )
       .setColor(bot.get("cor"))
       interaction.reply({embeds:[embed],ephemeral:true})
 }

 if(interaction.customId === "rendimentomes") {
  const embed = new EmbedBuilder()
       .setTitle(`${interaction.guild.name} | Rendimentos Desse Mês`)
       .addFields(
           { name: `${emoji(8)} | Ultimos 30 dias:`, value: `${emoji(7)} | Pedidos ${setedias2 || "0"} \n${emoji(13)} | Recebimentos: R$${setediasrec2.toFixed(2) || "0"}`, inline: false },
       )
       .setColor(db.get("cor"))
       interaction.reply({embeds:[embed],ephemeral:true})
 }

 if(interaction.customId === "rendimentototal") {
  const embed = new EmbedBuilder()
       .setTitle(`${interaction.guild.name} | Rendimentos Total`)
       .addFields(
           { name: `${emoji(16)} | Todo Periodo:`, value: `${emoji(10)} | Pedidos ${db2.get(`pedidostotal`) || "0"} \n${emoji(3)} | Recebimentos: R$${tudo.toFixed(2) || "0"}`, inline: false }
       )
       .setColor(bot.get("cor"))
       interaction.reply({embeds:[embed],ephemeral:true})
 }
}) 
    }
}
function emoji(id) {
    try {
        const emj = personalizar.get(`${id}`);
        return emj || "❌";
    } catch {
        return "❌"
    }
}