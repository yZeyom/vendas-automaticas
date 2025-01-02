const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, ApplicationCommandOptionType, AttachmentBuilder } = require("discord.js")
const { JsonDatabase, } = require("wio.db");
const mercadopago = require("mercadopago")
const axios = require("axios")
const moment = require("moment")
const min = moment().add(24, 'hours');
const time = Math.floor(min.valueOf() / 1000);
const {bot,db,logs,pn,rd,vnd, token , personalizar, perm, saldo, } = require("../../database/index");
const {QuickDB} = require("quick.db");
const carrinho = new QuickDB({table:"carrinho"});

module.exports = {
   name: "adicionarsaldo",
   description: "Adicionar saldo via pix",
   type: ApplicationCommandType.ChatInput,
   options: [
     {
       name: "valor",
       description: "Valor que deseja adicionar",
       type: ApplicationCommandOptionType.Number,
       required: true
     }
   ],
   run: async(client, interaction) => {
     
     if (vnd.get('saldo') == false) return interaction.reply({ content: `${emoji(29)} o sistema de saldo está desativado.`, ephemeral: true })
    
     const valor = interaction.options.getNumber("valor")
     
     if (valor < Number(vnd.get(`saldomin`))) return interaction.reply({ content: `${emoji(29)} Está função foi definida para ter um VALOR MÍNIMO de ${vnd.get(`saldomin`)}`, ephemeral: true })
     
     var data_id = Math.floor(Math.random() * 999999999999999);
     carrinho.set(`${data_id}.status`, `Em andamento`)
     
     const embedsaldo = new EmbedBuilder()
      .setTitle(`Logs | Sistema de Saldo`)
      .setDescription(`${emoji(12)} | O ${interaction.user} acabou de solicitar o pagamento para adição de saldo no valor de \`R$${valor.toFixed(2)}\`,\n${emoji(12)} | Id do Pagamento: **${data_id}**`)
      .setColor(bot.get(`cor`))
      .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: `${interaction.user.username} - ${interaction.user.id}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
      .setTimestamp()
      
     const canal = interaction.guild.channels.cache.get(vnd.get(`logs_adm`))
     if(canal) {
        canal.send({ embeds: [embedsaldo] });
     }
     
     let valorparaadd = (valor * vnd.get(`saldobonus`)) / 100;
     
     const valorFinal = (parseFloat(Number(valor) + Number(valorparaadd)).toFixed(2));
     
     mercadopago.configurations.setAccessToken(vnd.get('acess_token'))
     var payment_data = {
            transaction_amount: Number(valor),
            description: `Adicionar Saldo - ${interaction.user.username}`,
            payment_method_id: 'pix',
            payer: {
              email: 'whiteqtesoca@gmail.com',
              first_name: 'Paula',
              last_name: 'Guimaraes',
              identification: {
                type: 'CPF',
                number: '07944777984'
              },
              address: {
                zip_code: '06233200',
                street_name: 'Av. das NaÃƒÂ§oes Unidas',
                street_number: '3003',
                neighborhood: 'Bonfim',
                city: 'Osasco',
                federal_unit: 'SP'
              }
            },
            notification_url: interaction.user.displayAvatarURL(),
        }
        
      mercadopago.payment.create(payment_data).then(function (data) {
        
        const buffer = Buffer.from(data.body.point_of_interaction.transaction_data.qr_code_base64, "base64");
        const attachment = new AttachmentBuilder(buffer, "payment.png");
        
        const row = new ActionRowBuilder()
         .addComponents(
            new ButtonBuilder()
             .setLabel('Pix Copia e Cola')
             .setEmoji(`<:Pix:1221876826402586835>`) 
             .setCustomId('cpc')
             .setDisabled(false)
             .setStyle(1),
            new ButtonBuilder()
             .setLabel('Qr Code')
             .setEmoji(`<:qrcode_cloud:1221878642267652139>`)
             .setCustomId('qrc')
             .setDisabled(false)
             .setStyle(1),
            new ButtonBuilder()
             .setEmoji(`<a:No_cloud:1221871824216920135>`)
             .setCustomId('cancelaar')
             .setDisabled(false)
             .setStyle(4)
         )
         
         const embed = new EmbedBuilder()
          .setTitle(`${client.user.username} | Sistema de pagamento`)
          .setDescription(`\`\`\`Pague com pix para receber seu Saldo.\`\`\`\n💰 **| Valor:**\nR$ ${valor.toFixed(2)}\n🎉 | Bônus de depósito:\n${vnd.get(`saldobonus`) || "0"}% - ${Number(valorFinal).toFixed(2) || "0"}\n🔍 | Pagamento expira em:\n<t:${time}:f> (<t:${time}:R>)`)
          .setFooter({ text: `Após efetuar o pagamento, o tempo de entrega do saldo chegar na sua conta é de no máximo 1 minuto!`})
          .setColor(bot.get(`cor`))
       //   .setImage('https://payment.png')
        
        interaction.reply({ embeds: [embed], components: [row], ephemeral: true }).then(msg => {
          
            const filter = i => i.member.id === interaction.user.id;
            const collector = msg.createMessageComponentCollector({ filter });
            collector.on('collect', interaction2 => {
                
                if (interaction2.customId == 'cpc') {
                  interaction2.reply({ content: `${data.body.point_of_interaction.transaction_data.qr_code}`, ephemeral: true });
                }
                
                if (interaction2.customId == 'qrc') {
                  interaction2.reply({ files: [attachment], ephemeral: true });
                }
                
                if (interaction2.customId == 'cancelaar') {
                  msg.edit({ content: `🔍 | Pagamento Cancelado`, embeds: [], components: [], ephemeral: true })
                  const embedsaldo2 = new EmbedBuilder()
                   .setTitle(`Logs | Adição de Saldo Cancelada!`)
                   .setDescription(`🔍 | O ${interaction.user} acabou de **Cancelar** o pagamento para adição de saldo no valor de \`R$${valor.toFixed(2)}\`,\n\n${emoji(12)} | Id do Pagamento: **${data_id}**`)
                   .setColor(bot.get(`cor`))
                   .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                   .setFooter({ text: `${interaction.user.username} - ${interaction.user.id}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
                   .setTimestamp()
                   
                 const canal2 = interaction.guild.channels.cache.get(vnd.get(`logs_adm`))
                 if(canal2) {
                    canal2.send({ embeds: [embedsaldo2] })
                 }
                }
           })
           
           const checkPaymentStatus = setInterval(() => {
             axios.get(`https://api.mercadolibre.com/collections/notifications/${data.body.id}`, {
                  headers: {
                    'Authorization': `Bearer ${vnd.get(`acess_token`)}`
                  }
              }).then(async (doc) => {
                if (doc.data.collection.status === "approved") {
                    clearInterval(checkPaymentStatus);
                    carrinho.set(`${data_id}.status`, `aprovado`)
                } else if(doc.data.collection.status === "cancelled") {
                    clearInterval(checkPaymentStatus);
                    msg.edit({ content: `🔍 | Pagamento Cancelado`, embeds: [], components: [], ephemeral: true })
                  const embedsaldo2 = new EmbedBuilder()
                   .setTitle(`Logs | Adição de Saldo Cancelada!`)
                   .setDescription(`🔍 | O ${interaction.user} acabou de **Cancelar** o pagamento para adição de saldo no valor de \`R$${valor.toFixed(2)}\`,\n\n${emoji(12)} | Id do Pagamento: **${data_id}**`)
                   .setColor(bot.get(`cor`))
                   .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                   .setFooter({ text: `${interaction.user.username} - ${interaction.user.id}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
                   .setTimestamp()
                   
                 const canal2 = interaction.guild.channels.cache.get(vnd.get(`logs_adm`))
                 if(canal2) {
                    canal2.send({ embeds: [embedsaldo2] })
                 } 
                }
              }).catch(err => {
                  console.error(err);
              });
           }, 2000)
           
           const timer = setInterval(() => {
             if (carrinho.get(`${data_id}.status`) == 'aprovado') {
              clearInterval(timer);
              clearInterval(checkPaymentStatus);
               msg.edit({ content: `✅ | Pagamento aprovado.`, embeds: [], components: [], ephemeral: true })
               if (vnd.get(`saldobonus`) != 0) {
                saldo.add(`${interaction.user.id}.saldo`, `${Number(valorFinal).toFixed(2)}`)
                saldo.add(`${interaction.user.id}.gasto`, `${Number(valorFinal).toFixed(2)}`)
               } else {
                saldo.add(`${interaction.user.id}.saldo`, `${Number(valor).toFixed(2)}`)
                saldo.add(`${interaction.user.id}.gasto`, `${Number(valor).toFixed(2)}`)
              }
             }
           }, 2000)
           
        })
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