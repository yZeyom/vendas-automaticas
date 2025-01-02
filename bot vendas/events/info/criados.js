const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, ActivityType, StringSelectMenuBuilder, ChannelSelectMenuBuilder, ChannelType, RoleSelectMenuBuilder, ComponentType } = require("discord.js");
const {bot,carrinho,db,logs,pn,rd,vnd, token, personalizar, cupom, key, gift, drop} = require("../../database/index"); 
let timer;
const axios = require("axios");

module.exports = {
    name:"interactionCreate", // Nome do Evento 
    run: async( interaction, client) => {
        const customId = interaction.customId;
        if(!customId) return;
        const userid = customId.split("_")[0];

        if(interaction.user.id !== userid) return;
        if(customId.endsWith("_produtosall")) {
            
    const grana = db.all();
    
    if (grana.length < 1) return interaction.reply({content:`${emoji(2)} | Nenhum Produto foi criado!`, ephemeral:true});
    
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
        
        return `${emoji(4)}** | ID:** ${entry.ID}\n${emoji(32)}** | Nome:** ${entry.data.nome}\n${emoji(3)} **| Preço:** ${entry.data.preco}\n${emoji(14)} **| QUANTIDADE:** ${entry.data.conta.length}`;
      }).join('\n\n');

      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
          .setCustomId('primeiraPagina')
          .setEmoji('⏮️')
          .setDisabled(page === 0)
          .setStyle(2),
        )
        .addComponents(
          new ButtonBuilder()
            .setCustomId('voltar')
            .setEmoji('⬅️')
            .setDisabled(page === 0)
            .setStyle(2),
        )
        .addComponents(
          new ButtonBuilder()
          .setCustomId('gopage')
          .setLabel('Go To Page')
          .setEmoji('📄')
          .setStyle(3),
        )
        .addComponents(
          new ButtonBuilder()
            .setCustomId('proximo')
            .setEmoji('➡️')
            .setDisabled(page === Math.ceil(grana.length / pageSize) - 1)
            .setStyle(2),
        )
        .addComponents(
          new ButtonBuilder()
          .setCustomId('ultimaPagina')
          .setEmoji('⏭️')
          .setDisabled(page === Math.ceil(grana.length / pageSize) - 1)
          .setStyle(2),
         );
      
      const userPosition = grana.findIndex(entry => entry.ID === interaction.user.id) + 1;
      
      const embed = new EmbedBuilder()
        .setTitle('Produto:')
        .setColor(bot.get(`cor`))
        .setFooter({text:`Página ${page + 1} de ${Math.ceil(grana.length / pageSize)}`})
        .setDescription(`\n${formattedValues}`); 
      
      return { embed, components: [row] };
    };
    
    const { embed, components } = displayPage();
    const sentMessage = await interaction.reply({ embeds: [embed], components, ephemeral:true });

    const a = await interaction.fetchReply()
    const filter = i => i.message.id === a.id;
    const collector = interaction.channel.createMessageComponentCollector({filter});
    collector.on('collect', async (interaction) => {
      
      if (interaction.customId === 'proximo') {
        page += 1;
        const { embed, components } = displayPage();
        await interaction.update({ embeds: [embed], components });
      } else if (interaction.customId === 'voltar') {
        page -= 1;
        const { embed, components } = displayPage();
        await interaction.update({ embeds: [embed], components });
      } else if (interaction.customId === 'ultimaPagina') {
        page = Math.ceil(grana.length / pageSize) - 1;
        const { embed, components } = displayPage();
        await interaction.update({ embeds: [embed], components });
      } else if (interaction.customId === 'primeiraPagina') {
        page = 0;
        const { embed, components } = displayPage();
        await interaction.update({ embeds: [embed], components });  
      }
      // ...
      if (interaction.customId === "gopage") {

        const modal = new ModalBuilder()
        .setCustomId("gotopagerank")
        .setTitle("Go To Page")
      
        const num = new TextInputBuilder()
        .setCustomId("pagina")
        .setLabel("Qual vai ser a pagina?")
        .setStyle(1)
        .setMaxLength(2)
        .setRequired(true)
        .setPlaceholder("Escolha entre 1 a 99")
        modal.addComponents(new ActionRowBuilder().addComponents(num))
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
          interaction.reply({ content: "Número de página inválido. Certifique-se de inserir um número válido dentro do intervalo.", ephemeral: true });
        }
      
      } 
      })
      
    });
        }
        if(customId.endsWith("_cuponsall")) {
            
            const grana = cupom.all() 
            
            if (grana.length < 1) return interaction.reply({content:`${emoji(2)} | Nenhum Cupom foi criado!`, ephemeral:true});
            
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
                
                return `${emoji(4)}** | Nome:** ${entry.ID}\n${emoji(3)}** | Valor de Desconto:** ${entry.data.porcentagem}\n${emoji(25)} **| Valor de Pedido Mínimo:** ${entry.data.valorminimo}\n${emoji(14)} **| QUANTIDADE:** ${entry.data.quantidade}`;
              }).join('\n\n');
        
              const row = new ActionRowBuilder()
                .addComponents(
                  new ButtonBuilder()
                  .setCustomId('primeiraPagina')
                  .setEmoji('⏮️')
                  .setDisabled(page === 0)
                  .setStyle(2),
                )
                .addComponents(
                  new ButtonBuilder()
                    .setCustomId('voltar')
                    .setEmoji('⬅️')
                    .setDisabled(page === 0)
                    .setStyle(2),
                )
                .addComponents(
                  new ButtonBuilder()
                  .setCustomId('gopage')
                  .setLabel('Go To Page')
                  .setEmoji('📄')
                  .setStyle(3),
                )
                .addComponents(
                  new ButtonBuilder()
                    .setCustomId('proximo')
                    .setEmoji('➡️')
                    .setDisabled(page === Math.ceil(grana.length / pageSize) - 1)
                    .setStyle(2),
                )
                .addComponents(
                  new ButtonBuilder()
                  .setCustomId('ultimaPagina')
                  .setEmoji('⏭️')
                  .setDisabled(page === Math.ceil(grana.length / pageSize) - 1)
                  .setStyle(2),
                 );
              
              const userPosition = grana.findIndex(entry => entry.ID === interaction.user.id) + 1;
              
              const embed = new EmbedBuilder()
                .setTitle('Cupons:')
                .setColor(bot.get(`cor`))
                .setFooter({text:`Página ${page + 1} de ${Math.ceil(grana.length / pageSize)}`})
                .setDescription(`\n${formattedValues}`); 
              
              return { embed, components: [row] };
            };
            
            const { embed, components } = displayPage();
            const sentMessage = await interaction.reply({ embeds: [embed], components, ephemeral:true });
            
            const a = await interaction.fetchReply()
            const filter = i => i.message.id === a.id;
            const collector = interaction.channel.createMessageComponentCollector({filter});
            
            collector.on('collect', async (interaction) => {
              if (interaction.user.id !== interaction.user.id) {
                return;
              }
              
              if (interaction.customId === 'proximo') {
                page += 1;
                const { embed, components } = displayPage();
                await interaction.update({ embeds: [embed], components });
              } else if (interaction.customId === 'voltar') {
                page -= 1;
                const { embed, components } = displayPage();
                await interaction.update({ embeds: [embed], components });
              } else if (interaction.customId === 'ultimaPagina') {
                page = Math.ceil(grana.length / pageSize) - 1;
                const { embed, components } = displayPage();
                await interaction.update({ embeds: [embed], components });
              } else if (interaction.customId === 'primeiraPagina') {
                page = 0;
                const { embed, components } = displayPage();
                await interaction.update({ embeds: [embed], components });  
              }
              // ...
              if (interaction.customId === "gopage") {
        
                const modal = new ModalBuilder()
                .setCustomId("gotopagerank")
                .setTitle("Go To Page")
              
                const num = new TextInputBuilder()
                .setCustomId("pagina")
                .setLabel("Qual vai ser a pagina?")
                .setStyle(1)
                .setMaxLength(2)
                .setRequired(true)
                .setPlaceholder("Escolha entre 1 a 99")
                modal.addComponents(new ActionRowBuilder().addComponents(num))
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
                  interaction.reply({ content: "Número de página inválido. Certifique-se de inserir um número válido dentro do intervalo.", ephemeral: true });
                }
              
              } 
              })
              
            });
        }
        if(customId.endsWith("_keysall")) {
          const grana = key.all() 
          
          if (grana.length < 1) return interaction.reply({content:`${emoji(2)} | Nenhum Cupom foi criado!`, ephemeral:true});
          
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
              
              return `${emoji(4)} | **Key:** ${entry.ID} \n${emoji(12)} | ID do cargo: ${entry.data}\n${emoji(17)} | Cargo: <@&${entry.data}>`;
            }).join('\n\n');
      
            const row = new ActionRowBuilder()
              .addComponents(
                new ButtonBuilder()
                .setCustomId('primeiraPagina')
                .setEmoji('⏮️')
                .setDisabled(page === 0)
                .setStyle(2),
              )
              .addComponents(
                new ButtonBuilder()
                  .setCustomId('voltar')
                  .setEmoji('⬅️')
                  .setDisabled(page === 0)
                  .setStyle(2),
              )
              .addComponents(
                new ButtonBuilder()
                .setCustomId('gopage')
                .setLabel('Go To Page')
                .setEmoji('📄')
                .setStyle(3),
              )
              .addComponents(
                new ButtonBuilder()
                  .setCustomId('proximo')
                  .setEmoji('➡️')
                  .setDisabled(page === Math.ceil(grana.length / pageSize) - 1)
                  .setStyle(2),
              )
              .addComponents(
                new ButtonBuilder()
                .setCustomId('ultimaPagina')
                .setEmoji('⏭️')
                .setDisabled(page === Math.ceil(grana.length / pageSize) - 1)
                .setStyle(2),
               );
            
            const userPosition = grana.findIndex(entry => entry.ID === interaction.user.id) + 1;
            
            const embed = new EmbedBuilder()
              .setTitle('Keys:')
              .setColor(bot.get(`cor`))
              .setFooter({text:`Página ${page + 1} de ${Math.ceil(grana.length / pageSize)}`})
              .setDescription(`\n${formattedValues}`); 
            
            return { embed, components: [row] };
          };
          
          const { embed, components } = displayPage();
          const msg = await interaction.reply({ embeds: [embed], components, ephemeral:true });
          const a = await interaction.fetchReply()
          const filter = i => i.message.id === a.id;
          const collector = interaction.channel.createMessageComponentCollector({filter});
          collector.on('collect', async(interaction) => {
            
            if (interaction.customId === 'proximo') {
              page += 1;
              const { embed, components } = displayPage();
              await interaction.update({ embeds: [embed], components });
            } else if (interaction.customId === 'voltar') {
              page -= 1;
              const { embed, components } = displayPage();
              await interaction.update({ embeds: [embed], components });
            } else if (interaction.customId === 'ultimaPagina') {
              page = Math.ceil(grana.length / pageSize) - 1;
              const { embed, components } = displayPage();
              await interaction.update({ embeds: [embed], components });
            } else if (interaction.customId === 'primeiraPagina') {
              page = 0;
              const { embed, components } = displayPage();
              await interaction.update({ embeds: [embed], components });  
            }
            // ...
            if (interaction.customId === "gopage") {
      
              const modal = new ModalBuilder()
              .setCustomId("gotopagerank")
              .setTitle("Go To Page")
            
              const num = new TextInputBuilder()
              .setCustomId("pagina")
              .setLabel("Qual vai ser a pagina?")
              .setStyle(1)
              .setMaxLength(2)
              .setRequired(true)
              .setPlaceholder("Escolha entre 1 a 99")
              modal.addComponents(new ActionRowBuilder().addComponents(num))
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
                interaction.reply({ content: "Número de página inválido. Certifique-se de inserir um número válido dentro do intervalo.", ephemeral: true });
              }
            
            } 
            })
            
          });
        }
        if(customId.endsWith("_giftcardall")) {
          const grana = gift.all() 
          
          if (grana.length < 1) return interaction.reply({content:`${emoji(2)} | Nenhum Cupom foi criado!`, ephemeral:true});
          
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
              
              return `${emoji(4)} | **GiftCard:** ${entry.ID} \n${emoji(3)} | **Valor do Gift:** ${Number(entry.data).toFixed(2)}`;
            }).join('\n\n');
      
            const row = new ActionRowBuilder()
              .addComponents(
                new ButtonBuilder()
                .setCustomId('primeiraPagina')
                .setEmoji('⏮️')
                .setDisabled(page === 0)
                .setStyle(2),
              )
              .addComponents(
                new ButtonBuilder()
                  .setCustomId('voltar')
                  .setEmoji('⬅️')
                  .setDisabled(page === 0)
                  .setStyle(2),
              )
              .addComponents(
                new ButtonBuilder()
                .setCustomId('gopage')
                .setLabel('Go To Page')
                .setEmoji('📄')
                .setStyle(3),
              )
              .addComponents(
                new ButtonBuilder()
                  .setCustomId('proximo')
                  .setEmoji('➡️')
                  .setDisabled(page === Math.ceil(grana.length / pageSize) - 1)
                  .setStyle(2),
              )
              .addComponents(
                new ButtonBuilder()
                .setCustomId('ultimaPagina')
                .setEmoji('⏭️')
                .setDisabled(page === Math.ceil(grana.length / pageSize) - 1)
                .setStyle(2),
               );
            
            const userPosition = grana.findIndex(entry => entry.ID === interaction.user.id) + 1;
            
            const embed = new EmbedBuilder()
              .setTitle('GiftCards:')
              .setColor(bot.get(`cor`))
              .setFooter({text:`Página ${page + 1} de ${Math.ceil(grana.length / pageSize)}`})
              .setDescription(`\n${formattedValues}`); 
            
            return { embed, components: [row] };
          };
          
          const { embed, components } = displayPage();
          const msg = await interaction.reply({ embeds: [embed], components, ephemeral:true });
          const a = await interaction.fetchReply()
          const filter = i => i.message.id === a.id;
          const collector = interaction.channel.createMessageComponentCollector({filter});
          collector.on('collect', async(interaction) => {
            
            if (interaction.customId === 'proximo') {
              page += 1;
              const { embed, components } = displayPage();
              await interaction.update({ embeds: [embed], components });
            } else if (interaction.customId === 'voltar') {
              page -= 1;
              const { embed, components } = displayPage();
              await interaction.update({ embeds: [embed], components });
            } else if (interaction.customId === 'ultimaPagina') {
              page = Math.ceil(grana.length / pageSize) - 1;
              const { embed, components } = displayPage();
              await interaction.update({ embeds: [embed], components });
            } else if (interaction.customId === 'primeiraPagina') {
              page = 0;
              const { embed, components } = displayPage();
              await interaction.update({ embeds: [embed], components });  
            }
            // ...
            if (interaction.customId === "gopage") {
      
              const modal = new ModalBuilder()
              .setCustomId("gotopagerank")
              .setTitle("Go To Page")
            
              const num = new TextInputBuilder()
              .setCustomId("pagina")
              .setLabel("Qual vai ser a pagina?")
              .setStyle(1)
              .setMaxLength(2)
              .setRequired(true)
              .setPlaceholder("Escolha entre 1 a 99")
              modal.addComponents(new ActionRowBuilder().addComponents(num))
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
                interaction.reply({ content: "Número de página inválido. Certifique-se de inserir um número válido dentro do intervalo.", ephemeral: true });
              }
            
            } 
            })
            
          });
        }
        if(customId.endsWith("_dropsall")) {
          const grana = drop.all() 
          
          if (grana.length < 1) return interaction.reply({content:`${emoji(2)} | Nenhum Cupom foi criado!`, ephemeral:true});
          
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
              
              return `🔑 | **Código:** ${entry.ID} \n🎉 | **OQUE SERÁ ENTREGUE:**\n ${entry.data}`;
            }).join('\n\n');
      
            const row = new ActionRowBuilder()
              .addComponents(
                new ButtonBuilder()
                .setCustomId('primeiraPagina')
                .setEmoji('⏮️')
                .setDisabled(page === 0)
                .setStyle(2),
              )
              .addComponents(
                new ButtonBuilder()
                  .setCustomId('voltar')
                  .setEmoji('⬅️')
                  .setDisabled(page === 0)
                  .setStyle(2),
              )
              .addComponents(
                new ButtonBuilder()
                .setCustomId('gopage')
                .setLabel('Go To Page')
                .setEmoji('📄')
                .setStyle(3),
              )
              .addComponents(
                new ButtonBuilder()
                  .setCustomId('proximo')
                  .setEmoji('➡️')
                  .setDisabled(page === Math.ceil(grana.length / pageSize) - 1)
                  .setStyle(2),
              )
              .addComponents(
                new ButtonBuilder()
                .setCustomId('ultimaPagina')
                .setEmoji('⏭️')
                .setDisabled(page === Math.ceil(grana.length / pageSize) - 1)
                .setStyle(2),
               );
            
            const userPosition = grana.findIndex(entry => entry.ID === interaction.user.id) + 1;
            
            const embed = new EmbedBuilder()
              .setTitle('GiftCards:')
              .setColor(bot.get(`cor`))
              .setFooter({text:`Página ${page + 1} de ${Math.ceil(grana.length / pageSize)}`})
              .setDescription(`\n${formattedValues}`); 
            
            return { embed, components: [row] };
          };
          
          const { embed, components } = displayPage();
          const msg = await interaction.reply({ embeds: [embed], components, ephemeral:true });
          const a = await interaction.fetchReply()
          const filter = i => i.message.id === a.id;
          const collector = interaction.channel.createMessageComponentCollector({filter});
          collector.on('collect', async(interaction) => {
            
            if (interaction.customId === 'proximo') {
              page += 1;
              const { embed, components } = displayPage();
              await interaction.update({ embeds: [embed], components });
            } else if (interaction.customId === 'voltar') {
              page -= 1;
              const { embed, components } = displayPage();
              await interaction.update({ embeds: [embed], components });
            } else if (interaction.customId === 'ultimaPagina') {
              page = Math.ceil(grana.length / pageSize) - 1;
              const { embed, components } = displayPage();
              await interaction.update({ embeds: [embed], components });
            } else if (interaction.customId === 'primeiraPagina') {
              page = 0;
              const { embed, components } = displayPage();
              await interaction.update({ embeds: [embed], components });  
            }
            // ...
            if (interaction.customId === "gopage") {
      
              const modal = new ModalBuilder()
              .setCustomId("gotopagerank")
              .setTitle("Go To Page")
            
              const num = new TextInputBuilder()
              .setCustomId("pagina")
              .setLabel("Qual vai ser a pagina?")
              .setStyle(1)
              .setMaxLength(2)
              .setRequired(true)
              .setPlaceholder("Escolha entre 1 a 99")
              modal.addComponents(new ActionRowBuilder().addComponents(num))
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
                interaction.reply({ content: "Número de página inválido. Certifique-se de inserir um número válido dentro do intervalo.", ephemeral: true });
              }
            
            } 
            })
            
          });
        }
    }}
    function emoji(id) {
        try {
            const emj = personalizar.get(`${id}`);
            return emj || "❌";
        } catch {
            return "❌"
        }
    }