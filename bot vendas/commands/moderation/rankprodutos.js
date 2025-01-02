const Discord = require("discord.js");
const { JsonDatabase } = require("wio.db");
const {bot,carrinho,db,logs,pn,rd,vnd, token, personalizar, cupom, key, gift, drop, saldo, perm} = require("../../database/index"); 

module.exports = {
  name: "rankprodutos",
  description:"[🛠|💰 Vendas Moderação] Veja os produtos que mais geraram lucro!",
  type:Discord.ApplicationCommandType.ChatInput,
  run: async (client, interaction,message, args) => {
    if(!await perm.get(interaction.user.id)) return interaction.reply({content:`🔎 | Apenas quem tem permissão podê usar este comando`})
    const grana = db.all().sort((a, b) => b.data.estatisticas.rendeu - a.data.estatisticas.rendeu);
    
    if (grana.length < 1) return interaction.reply(`Não foi criado nenhum produto!`, message);
    
    const inbiza = db.all();
    const pageSize = 10;
    let page = 0;
    
    const displayPage = () => {
      const pageStart = page * pageSize;
      const pageEnd = pageStart + pageSize;
      const pageItems = grana.slice(pageStart, pageEnd);
      
      let start = (page - 1) * pageSize;
      let end = start + pageSize;
      
      const numInicial = page * pageSize + 1; 
      
      const formattedValues = pageItems.map((entry, index) => {
        const numRanking = numInicial + index; 
        let medalha = ""; 
        
        if (numRanking === 1) {
          medalha = '🥇';
        } else if (numRanking === 2) {
          medalha = '🥈';
        } else if (numRanking === 3) {
          medalha = '🥉';
        } else {
          medalha = '🏅';
        }
        
        return `${medalha} | **__${numRanking}°__** - ID: \`${entry.ID}\` - Nome: \`${entry.data.nome}\`\n💳 | Rendeu: **R$${Number(entry.data.estatisticas.rendeu).toFixed(2)}**\n🛒 | Total de vendas: **${entry.data.estatisticas.total}**`;
      }).join('\n\n');

      const row = new Discord.ActionRowBuilder()
        .addComponents(
          new Discord.ButtonBuilder()
          .setCustomId('primeiraPagina')
          .setEmoji('⏮️')
          .setDisabled(page === 0)
          .setStyle(2),
        )
        .addComponents(
          new Discord.ButtonBuilder()
            .setCustomId('voltar')
            .setEmoji('⬅️')
            .setDisabled(page === 0)
            .setStyle(2),
        )
        .addComponents(
          new Discord.ButtonBuilder()
          .setCustomId('gopage')
          .setLabel('Go To Page')
          .setDisabled(page === 0)
          .setEmoji('📄')
          .setStyle(3),
        )
        .addComponents(
          new Discord.ButtonBuilder()
            .setCustomId('proximo')
            .setEmoji('➡️')
            .setDisabled(page === Math.ceil(grana.length / pageSize) - 1)
            .setStyle(2),
        )
        .addComponents(
          new Discord.ButtonBuilder()
          .setCustomId('ultimaPagina')
          .setEmoji('⏭️')
          .setDisabled(page === Math.ceil(grana.length / pageSize) - 1)
          .setStyle(2),
         );
      
      const userPosition = grana.findIndex(entry => entry.ID === interaction.user.id) + 1;
      
      const embed = new Discord.EmbedBuilder()
        .setTitle('Rank Produtos:')
        .setColor(bot.get("cor"))
        .setFooter({text:`Página ${page + 1} de ${Math.ceil(grana.length / pageSize)}`})
        .setDescription(`\n${formattedValues}`);

      
      //const user = `${db.get(`${interaction.user.id}`)}`;
      
      /*
      if (!user) {
        embed.addField('🏆 | Sua posição:', `\`Você não está no rank\``)
      } else {
        embed.addField('🏆 | Sua posição:', `🏅 | **__${userPosition}°__**`)
      }
      */
      
      return { embed, components: [row] };
    };
    
    const { embed, components } = displayPage();
    const sentMessage = await interaction.reply({ embeds: [embed], components });
    
    const collector = sentMessage.createMessageComponentCollector({ componentType: Discord.ComponentType.Button });
    
    collector.on('collect', async (interaction) => {
      if (interaction.user.id !== interaction.user.id) {
        return;
      }
      
      if (interaction.customId === 'proximo') {
        page += 1;
      } else if (interaction.customId === 'voltar') {
        page -= 1;
      } else if (interaction.customId === 'ultimaPagina') {
        page = Math.ceil(grana.length / pageSize) - 1;
      } else if (interaction.customId === 'primeiraPagina') {
        page = 0;
      }
      // ...
      if (interaction.customId === "gopage") {

        const modal = new Discord.ModalBuilder()
        .setCustomId("gotopagerank")
        .setTitle("Go To Page")
      
        const num = new Discord.TextInputBuilder()
        .setCustomId("pagina")
        .setLabel("Qual vai ser a pagina?")
        .setStyle(1)
        .setMaxLength(2)
        .setRequired(true)
        .setPlaceholder("Escolha entre 1 a 99")
        modal.addComponents(new Discord.ActionRowBuilder().addComponents(num))
        await interaction.showModal(modal)
      }
      client.once('interactionCreate', async (interaction) => {
      if(interaction.isModalSubmit() && interaction.customId === "gotopagerank") {
        const text = interaction.fields.getTextInputValue('pagina')
      
        const newPage = parseInt(text)
        if (!isNaN(newPage) && newPage >= 1 && newPage <= Math.ceil(grana.length / pageSize)) {
          page = newPage - 1;
          const { embed, components } = displayPage();
      
          await interaction.update({ embeds: [embed], components });
        } else {
          iinteraction.reply({ content: "Número de página inválido. Certifique-se de inserir um número válido dentro do intervalo.", ephemeral: true }); 
        }
      
      } 
      })
      
      const { embed, components } = displayPage();
      await interaction.update({ embeds: [embed], components });
    });
  },
};