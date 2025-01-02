const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, ActivityType, StringSelectMenuBuilder, ChannelSelectMenuBuilder, ChannelType, RoleSelectMenuBuilder } = require("discord.js");
const {bot,carrinho,db,logs,pn,rd,vnd, token, personalizar} = require("../../database/index"); 
let timer;
const axios = require("axios");

module.exports = {
    name:"interactionCreate", 
    run: async( interaction, client) => {
        const customId = interaction.customId;
        if(!customId) return;
        const userid = customId.split("_")[0];
        const colorembed = await bot.get("cor");

        if(interaction.user.id !== userid) return;

        if(interaction.isButton()) {

            if(customId.endsWith("_mensagemcompra")){
                resettime();
                await embed();  
            }

            if(customId.endsWith("_resetembed")){
                resettime();
                const a = bot.set("mensagem_compra.titulo", `${interaction.client.user.username} | Produto`)
                await bot.set(`mensagem_compra`, {
                    "titulo":`${a}`,
                    "desc":"```#{desc}```\n🪐** | Nome: #{nome}\n💸 | Preço: __R$#{preco}__\n📦 | Estoque: __#{estoque}__**",
                    "rodape":"Sem Rodapé",
                    "button":{
                        "text":"Comprar",
                        "style": 3,
                        "emoji":"<:carrin_cloud:1221873043958268045>"
                    }
                });
                embed();

            }

            if (customId.endsWith("_tituloembed")) {
              resettime();
                interaction.update({
                  embeds: [
                    new EmbedBuilder().setColor(colorembed)
                      .setTitle(`${interaction.client.user.username} | Personalizar Mensagem de Compra`)
                      .setDescription(`Envie o novo titulo da embed de compra, caso queira use as váriaveis:\n- \`#{nome}\`\n - \`#{preco}\` \n - \`#{estoque}\``)
                  ],
                  components: [
                    new ActionRowBuilder()
                      .addComponents(
                        new ButtonBuilder()
                          .setCustomId(`${userid}_cancelled`)
                          .setLabel("Cancelar")
                          .setEmoji("<a:No_cloud:1221871824216920135>")
                          .setStyle(4)
                      )
                  ]
                });
              
  const filterMensagem = (msg) => msg.author.id === interaction.user.id;
  const collectorMensagem = interaction.channel.createMessageCollector({ filter: filterMensagem });

  
  collectorMensagem.on("collect", async (mensagem) => {
    await mensagem.delete();
    collectorMensagem.stop();
    await bot.set(`mensagem_compra.titulo`, mensagem.content)
    await embededit();
    
  });

  
  const filterBotao = (i) => i.customId.startsWith(userid) && i.customId.endsWith("_cancelled") && i.user.id === interaction.user.id;
  const collectorBotao = interaction.channel.createMessageComponentCollector({ filter: filterBotao});

  
  collectorBotao.on("collect", (i) => {
    collectorMensagem.stop();
    collectorBotao.stop("cancelled");
    i.deferUpdate();
    embededit();
  });

            }

            if (customId.endsWith("_descembed")) {
              resettime();
                interaction.update({
                  embeds: [
                    new EmbedBuilder().setColor(colorembed)
                      .setTitle(`${interaction.client.user.username} | Personalizar Mensagem de Compra`)
                      .setImage("https://media.discordapp.net/attachments/1193039890061987933/1193642520211628192/image.png?ex=65ad7539&is=659b0039&hm=779f9d5cf656127fa7bd96b8145c0a7f099c9c7cf00464c60d7f2311c6572783&=&format=webp&quality=lossless")
                      .setDescription(`${emoji(30)} | Envie a nova descrição da embed de compra, use as váriaveis: \n- \`#{desc}\` \n - \`#{nome}\` \n - \`#{preco}\` \n - \`#{estoque}\` \n\n **Exemplo:**`)
                  ],
                  components: [
                    new ActionRowBuilder()
                      .addComponents(
                        new ButtonBuilder()
                          .setCustomId(`${userid}_cancelled`)
                          .setLabel("Cancelar")
                          .setEmoji("<a:No_cloud:1221871824216920135>")
                          .setStyle(4)
                      )
                  ]
                });
              
  const filterMensagem = (msg) => msg.author.id === interaction.user.id;
  const collectorMensagem = interaction.channel.createMessageCollector({ filter: filterMensagem });

  
  collectorMensagem.on("collect", async (mensagem) => {
    await mensagem.delete();
    collectorMensagem.stop();
    await bot.set(`mensagem_compra.desc`, mensagem.content)
    await embededit();
    
  });

  
  const filterBotao = (i) => i.customId.startsWith(userid) && i.customId.endsWith("_cancelled") && i.user.id === interaction.user.id;
  const collectorBotao = interaction.channel.createMessageComponentCollector({ filter: filterBotao});

  
  collectorBotao.on("collect", (i) => {
    collectorMensagem.stop();
    collectorBotao.stop("cancelled");
    i.deferUpdate();
    embededit(); 
  });

            }
            if (customId.endsWith("_rodapeembed")) {
              resettime();
                  interaction.update({
                    embeds: [
                      new EmbedBuilder().setColor(colorembed)
                        .setTitle(`${interaction.client.user.username} | Personalizar Mensagem de Compra`)
                        .setDescription(`${emoji(30)} | Envie o novo rodapé abaixo:** Obs: Caso queira remover envie \"remover\"**`)
                    ],
                    components: [
                      new ActionRowBuilder()
                        .addComponents(
                          new ButtonBuilder()
                            .setCustomId(`${userid}_cancelled`)
                            .setLabel("Cancelar")
                            .setEmoji("<a:No_cloud:1221871824216920135>")
                            .setStyle(4)
                        )
                    ]
                  });
                
    const filterMensagem = (msg) => msg.author.id === interaction.user.id;
    const collectorMensagem = interaction.channel.createMessageCollector({ filter: filterMensagem });
  
    
    collectorMensagem.on("collect", async (mensagem) => {
      await mensagem.delete(); 
      collectorMensagem.stop();
      if(mensagem.content === "remover") {
        await bot.set(`mensagem_compra.rodape`, "Sem Rodapé");
        await embededit();
      } else {
        await bot.set(`mensagem_compra.rodape`, mensagem.content);
        await embededit();
      }
      
    });
  
    
    const filterBotao = (i) => i.customId.startsWith(userid) && i.customId.endsWith("_cancelled") && i.user.id === interaction.user.id;
    const collectorBotao = interaction.channel.createMessageComponentCollector({ filter: filterBotao});
  
    
    collectorBotao.on("collect", (i) => {
      collectorMensagem.stop();
      collectorBotao.stop("cancelled");
      i.deferUpdate();
      embededit();
    });
  
            }

            if(customId.endsWith("_voltarpern")) {
              resettime();
             await interaction.update({
                embeds:[
                    new EmbedBuilder().setColor(colorembed)
                    .setTitle(`${interaction.client.user.username} | Personalizar`)
                    .setDescription(`Clique no que você deseja personalizar:`)
                ],
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${interaction.user.id}_mensagemcompra`)
                        .setLabel("Mensagem de Compra")
                        .setEmoji("<:config_cloud:1213558269633892352>")
                        .setStyle(1),
                        new ButtonBuilder()
                        .setCustomId(`${interaction.user.id}_alteraremojis`)
                        .setLabel("Alterar Emojis Padrões")
                        .setEmoji("<:config_cloud:1213558269633892352>")
                        .setStyle(1),
                    )
                ]
            }) 
            }

            if(customId.endsWith("_buttonembed")) {
              resettime();
              buttonembed();
            }
            
            if(customId.endsWith("_textbuttonmudar")) {
              resettime()
              const modal = new ModalBuilder()
              .setCustomId(`${userid}_modaltextbutton`)
              .setTitle("🔧 | Alterar Texto do Botão");

              const text = new TextInputBuilder()
              .setCustomId("text")
              .setStyle(1)
              .setPlaceholder("Ex: Comprar")
              .setMaxLength(50)
              .setLabel("Novo Texto do Botão")
              .setRequired(true);

              modal.addComponents(new ActionRowBuilder().addComponents(text));

              return interaction.showModal(modal);
            }
            
            if(customId.endsWith("_corbuttonmudar")) {
              resettime();
              interaction.update({
                embeds:[
                  new EmbedBuilder().setColor(colorembed)
                  .setTitle(`${interaction.client.user.username} | Personalizar mensagem de Compra`)
                  .setDescription(`${emoji(46)} | Escolha uma cor para o botão:`)
                ],
                components:[
                  new ActionRowBuilder()
                  .addComponents(
                    new ButtonBuilder()
                    .setCustomId(`${userid}_azulbuttoncolor`)
                    .setLabel("Azul")
                    .setStyle(1),
                    new ButtonBuilder()
                    .setCustomId(`${userid}_vermelhobuttoncolor`)
                    .setLabel("Vermelho")
                    .setStyle(4),
                    new ButtonBuilder()
                    .setCustomId(`${userid}_verdebuttoncolor`)
                    .setLabel("Verde")
                    .setStyle(3),
                    new ButtonBuilder()
                    .setCustomId(`${userid}_cinzabuttoncolor`)
                    .setLabel("Cinza")
                    .setStyle(2),
                    new ButtonBuilder()
                    .setCustomId(`${userid}_buttonembed`)
                    .setLabel("Voltar")
                    .setEmoji("⬅")
                    .setStyle(2),

                  )
                ]
              });
            } 
            if(customId.endsWith("_azulbuttoncolor")){
              resettime();
              await bot.set(`mensagem_compra.button.style`, 1);
              await buttonembed();

            }
            if(customId.endsWith("_vermelhobuttoncolor")){
              resettime();
              await bot.set(`mensagem_compra.button.style`, 4);
              await buttonembed();
            }
            if(customId.endsWith("_verdebuttoncolor")){
              resettime();
              await bot.set(`mensagem_compra.button.style`, 3);
              await buttonembed();
            }
            if(customId.endsWith("_cinzabuttoncolor")){
              resettime();
              await bot.set(`mensagem_compra.button.style`, 2);
              await buttonembed();
            }
            if (customId.endsWith("_emojibutton")) {
              resettime();
                interaction.update({
                  embeds: [
                    new EmbedBuilder().setColor(colorembed)
                      .setTitle(`${interaction.client.user.username} | Personalizar Mensagem de Compra`)
                      .setDescription(`${emoji(30)} | Envie o Emoji abaixo:\n** O emoji tem que estar em um server que o bot também está!**`)
                  ],
                  components: [
                    new ActionRowBuilder()
                      .addComponents(
                        new ButtonBuilder()
                          .setCustomId(`${userid}_cancelled`)
                          .setLabel("Cancelar")
                          .setEmoji("<a:No_cloud:1221871824216920135>")
                          .setStyle(4)
                      )
                  ]
                });
              
  const filterMensagem = (msg) => msg.author.id === interaction.user.id;
  const collectorMensagem = interaction.channel.createMessageCollector({ filter: filterMensagem });

  
  collectorMensagem.on("collect", async (mensagem) => {
    await mensagem.delete();
    collectorMensagem.stop();
    const emojis = mensagem.content;
      
        const emojiverification = interaction.client.emojis.cache.find(emoji => `<:${emoji.name}:${emoji.id}>` === emojis) || interaction.client.emojis.cache.find(emoji => emoji.name === emojis) || interaction.client.emojis.cache.get(emojis);
        const emojiRegex = require("emoji-regex");
        function emojiverification2(str) {
          const emojiPattern = emojiRegex();
          const emojis = str.match(emojiPattern) || [];
            
          return emojis.length === 1;
      }

          if (!emojiverification && !emojiverification2(`${emojis}`)) {
             await interaction.followUp({
                ephemeral:true,
                 content:`❌ | Coloque um emoji Valido!`
                })
                await buttonembededit();
              return;
          }  
          await bot.set(`mensagem_compra.button.emoji`, emojis);
          await buttonembededit();
    
  });

  
  const filterBotao = (i) => i.customId.startsWith(userid) && i.customId.endsWith("_cancelled") && i.user.id === interaction.user.id;
  const collectorBotao = interaction.channel.createMessageComponentCollector({ filter: filterBotao});

  
  collectorBotao.on("collect", (i) => {
    collectorMensagem.stop();
    collectorBotao.stop("cancelled");
    i.deferUpdate();
    buttonembededit(); 
  });

            }
            if(customId.endsWith("_alteraremojis")) {
              resettime();
              emojiembed();
            }
            if(customId.endsWith("_alteraremojies")){
              resettime();
              const modal = new ModalBuilder()
              .setCustomId(`${userid}_modalemojipern`)
              .setTitle(`✏ | Alterar Emoji`);
              
              const text = new TextInputBuilder()
              .setCustomId("text")
              .setStyle(1)
              .setLabel("NÚMERO DO EMOJI:")
              .setMaxLength(2)
              .setRequired(true);

              modal.addComponents(new ActionRowBuilder().addComponents(text));

              return interaction.showModal(modal);
            }
            if(customId.endsWith("_resetemojies")){
              const modal = new ModalBuilder()
              .setCustomId(`${userid}_resetemojimodal`)
              .setTitle("🔧 | Resetar Emoji");

              const text = new TextInputBuilder()
              .setCustomId("text")
              .setStyle(1)
              .setPlaceholder("SIM")
              .setLabel("Caso Deseja Resetar Digite: \"SIM\"")
              .setRequired(true)
              .setMaxLength(3)
              .setMinLength(3);

              modal.addComponents(
                new ActionRowBuilder().addComponents(text)
              );

              return interaction.showModal(modal);
            }
        }

        if(interaction.isModalSubmit()) {
          if(customId.endsWith("_resetemojimodal")){
            resettime();
            const text = interaction.fields.getTextInputValue("text");
            if(text !== "SIM") return emojiembed();
            await interaction.reply({content:`🔁 | Aguarde um Momento...`, ephemeral:true});
            const emojis = {
              "0": "🪐",
              "1": "💥",
              "2": "❌",
              "3": "💸",
              "4": "📦",
              "5": "⚙️",
              "6": "🤖",
              "7": "💎",
              "8": "⚡",
              "9": "💫",
              "10": "👑", 
              "11": "✅",
              "12": "🔍",
              "13": "✨",
              "14": "🛒",
              "15": "📋",
              "16": "🔗", 
              "17": "👥",
              "18": "📦",
              "19": "🕒",
              "20": "✏️",
              "21": "💳",
              "22": "📅",
              "23": "➕",
              "24": "➖",
              "25": "🤝",
              "26": "🛠️",
              "27": "🆔",
              "28": "🐻",
              "29": "⚠️",
              "30": "➡️",
              "31": "🎁",
              "32": "📝",
              "33": "🔔",
              "34": "📣",
              "35": "🚨",
              "36": "🔗",
              "37": "🎉",
              "38": "🗑️",
              "39": "💾",
              "40": "🤝",
              "41": "📂",
              "42": "❤️",
              "43": "🙋‍♂️",
              "44":"🔁",
              "45":"💰",
              "46":"➡"
          };
          
          for (const key in emojis) {
              await personalizar.set(key, emojis[key]);
          }
          interaction.editReply({content:`${emoji(11)} | Todos os Emojis foram resetados com sucesso`, ephemeral:true});
          emojiembededit();
          }
          if(customId.endsWith("_modalemojipern")) {
            const text = interaction.fields.getTextInputValue("text");
            const emoji1 = await personalizar.get(`${text}`);
            if(!emoji1) return interaction.reply({content:`${emoji(29)} | Número do Emoji inválido!`, ephemeral:true});
            interaction.update({
              embeds: [
                new EmbedBuilder().setColor(colorembed)
                  .setTitle(`${interaction.client.user.username} | Alterar Emoji ・${text} - ${emoji1}`)
                  .setDescription(`${emoji(30)} | Envie o Emoji abaixo:\n** O emoji tem que estar em um server que o bot também está!**`)
              ],
              components: [
                new ActionRowBuilder()
                  .addComponents(
                    new ButtonBuilder()
                      .setCustomId(`${userid}_cancelled`)
                      .setLabel("Cancelar")
                      .setEmoji("<a:No_cloud:1221871824216920135>")
                      .setStyle(4)
                  )
              ]
            });
            const filterMensagem = (msg) => msg.author.id === interaction.user.id;
            const collectorMensagem = interaction.channel.createMessageCollector({ filter: filterMensagem });
          
            
            collectorMensagem.on("collect", async (mensagem) => {
              await mensagem.delete();
              collectorMensagem.stop();
              const emojis = mensagem.content;
                
                  const emojiverification = interaction.client.emojis.cache.find(emoji => `<:${emoji.name}:${emoji.id}>` === emojis) || interaction.client.emojis.cache.find(emoji => emoji.name === emojis) || interaction.client.emojis.cache.get(emojis);

                  const emojiRegex  = require("emoji-regex");
                  function emojiverification2(str) {
                    const emojiPattern = emojiRegex();
                    const emojis = str.match(emojiPattern) || [];
                      
                    return emojis.length === 1;
                }
          
                    if (!emojiverification && !emojiverification2(`${emojis}`)) {
                       await interaction.followUp({
                          ephemeral:true,
                           content:`❌ | Coloque um emoji Valido!`
                          })
                          await emojiembededit();
                        return;
                    }  
                    await personalizar.set(`${text}`, emojis);
                    await emojiembededit();
              
            });
          
            
            const filterBotao = (i) => i.customId.startsWith(userid) && i.customId.endsWith("_cancelled") && i.user.id === interaction.user.id;
            const collectorBotao = interaction.channel.createMessageComponentCollector({ filter: filterBotao});
          
            
            collectorBotao.on("collect", (i) => {
              collectorMensagem.stop();
              collectorBotao.stop("cancelled");
              i.deferUpdate();
              emojiembededit(); 
            });

          }
          if (customId.endsWith("_modaltextbutton")) {
            resettime();
          await bot.set(`mensagem_compra.button.text`, interaction.fields.getTextInputValue("text"));
          await buttonembed();
        }
        } 

        async function emojiembededit() {
          const all = await personalizar.all();
          let tots = ""
          all.map((emoji) => {
            tots += `・${emoji.ID} - ${emoji.data} \n`;
          });

          await interaction.message.edit({
            embeds:[ 
              new EmbedBuilder()
              .setTitle(`${interaction.client.user.username} | Gerenciar Emojis`)
              .setDescription(`Este são os emojis atuais:\n${tots}`)
              .setFooter({text:`Para alterar um emoji você deverá enviar o número do emoji, após clicar no botão abaixo!`, iconURL: interaction.client.user.displayAvatarURL()})
            ],
            components:[
              new ActionRowBuilder()
              .addComponents(
                new ButtonBuilder()
                .setCustomId(`${userid}_alteraremojies`)
                .setLabel("Alterar Emoji")
                .setEmoji("<:config_cloud:1213558269633892352>")
                .setStyle(1),
                new ButtonBuilder()
                .setCustomId(`${userid}_resetemojies`)
                .setLabel("Resetar Emoji")
                .setEmoji("<a:No_cloud:1221871824216920135>")
                .setStyle(4),
                new ButtonBuilder()
                .setCustomId(`${userid}_voltarpern`)
                .setLabel("Voltar")
                .setEmoji("⬅")
                .setStyle(2),
              )
            ]
          });
        }
        async function emojiembed() {
          const all = await personalizar.all();
          let tots = ""
          all.map((emoji) => {
            tots += `・${emoji.ID} - ${emoji.data} \n`;
          });

          await interaction.update({
            embeds:[ 
              new EmbedBuilder()
              .setTitle(`${interaction.client.user.username} | Gerenciar Emojis`)
              .setDescription(`Este são os emojis atuais:\n${tots}`)
              .setFooter({text:`Para alterar um emoji você deverá enviar o número do emoji, após clicar no botão abaixo!`, iconURL: interaction.client.user.displayAvatarURL()})
            ],
            components:[
              new ActionRowBuilder()
              .addComponents(
                new ButtonBuilder()
                .setCustomId(`${userid}_alteraremojies`)
                .setLabel("Alterar Emoji")
                .setEmoji("<:config_cloud:1213558269633892352>")
                .setStyle(1),
                new ButtonBuilder()
                .setCustomId(`${userid}_resetemojies`)
                .setLabel("Resetar Emoji")
                .setEmoji("<a:No_cloud:1221871824216920135>")
                .setStyle(4),
                new ButtonBuilder()
                .setCustomId(`${userid}_voltarpern`)
                .setLabel("Voltar")
                .setEmoji("⬅")
                .setStyle(2),
              )
            ]
          });
        }
        async function embededit() {
            const embed = await bot.get("mensagem_compra");
           await interaction.editReply({
                embeds:[
                    new EmbedBuilder().setColor(colorembed)
                    .setTitle(`${interaction.client.user.username} | Personalizar Mensagem de Compra`)
                    .setDescription(`** Título atual:** \`${embed.titulo}\`\n\n**Descrição Atual:** ${embed.desc}\n\n**Rodapé Atual:** \`${embed.rodape}\``)
                    .setFooter({text:"Escolha oque você deseja mudar:",iconURL: interaction.client.user.displayAvatarURL()})
                ],
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_tituloembed`)
                        .setLabel("Título da embed")
                        .setEmoji("<:config_cloud:1213558269633892352>")
                        .setStyle(1),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_descembed`)
                        .setLabel("Descrição da embed")
                        .setEmoji("<:config_cloud:1213558269633892352>")
                        .setStyle(1),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_rodapeembed`)
                        .setLabel("Rodapé da embed")
                        .setEmoji("<:config_cloud:1213558269633892352>")
                        .setStyle(1),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_buttonembed`)
                        .setLabel("Botão da Embed")
                        .setEmoji("<:config_cloud:1213558269633892352>")
                        .setStyle(1),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_resetembed`)
                        .setLabel("Resetar Embed")
                        .setEmoji("<:config_cloud:1213558269633892352>")
                        .setStyle(4),
                    ),
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_voltarpern`)
                        .setStyle(2)
                        .setEmoji("⬅")
                        .setLabel("Voltar")
                    )
                ]
            });
        }
        async function buttonembededit() {
          
          const stl = await buttonstyle();
          const button = await bot.get(`mensagem_compra.button`);

         await interaction.message.edit({
            embeds:[
              new EmbedBuilder().setColor(colorembed)
              .setTitle(`${interaction.client.user.username} | Personalizar Mensagem de Compra`)
              .setDescription(`**Texto do Botão:** \`${button.text}\`\n\n**Cor do Botão:** ${stl} \n\n**Emoji do Botão:** ${button.emoji}`)
              .setFooter({text:"Escolha oque você deseja mudar:", iconURL: interaction.client.user.displayAvatarURL()})
            ],
            components:[
              new ActionRowBuilder() 
              .addComponents(
                new ButtonBuilder()
                .setCustomId(`${userid}_textbuttonmudar`)
                .setLabel("Texto do Botão")
                .setEmoji("<:config_cloud:1213558269633892352>")
                .setStyle(1),
                new ButtonBuilder()
                .setCustomId(`${userid}_corbuttonmudar`)
                .setLabel("Cor do Botão")
                .setEmoji("<:config_cloud:1213558269633892352>")
                .setStyle(1),
                new ButtonBuilder()
                .setCustomId(`${userid}_emojibutton`)
                .setLabel("Emoji do Botão")
                .setEmoji("<:config_cloud:1213558269633892352>")
                .setStyle(1),
                new ButtonBuilder()
                .setCustomId(`${userid}_mensagemcompra`)
                .setLabel("Voltar")
                .setEmoji("⬅")
                .setStyle(2),
              )
            ]
          })
        }

        async function buttonembed() {
          
          const stl = await buttonstyle();
          const button = await bot.get(`mensagem_compra.button`);

         await interaction.update({
            embeds:[
              new EmbedBuilder().setColor(colorembed)
              .setTitle(`${interaction.client.user.username} | Personalizar Mensagem de Compra`)
              .setDescription(`**Texto do Botão:** \`${button.text}\`\n\n**Cor do Botão:** ${stl}\n\n**Emoji do Botão:** ${button.emoji}`)
              .setFooter({text:"Escolha oque você deseja mudar:", iconURL: interaction.client.user.displayAvatarURL()})
            ],
            components:[
              new ActionRowBuilder() 
              .addComponents(
                new ButtonBuilder()
                .setCustomId(`${userid}_textbuttonmudar`)
                .setLabel("Texto do Botão")
                .setEmoji("<:config_cloud:1213558269633892352>")
                .setStyle(1),
                new ButtonBuilder()
                .setCustomId(`${userid}_corbuttonmudar`)
                .setLabel("Cor do Botão")
                .setEmoji("<:config_cloud:1213558269633892352>")
                .setStyle(1),
                new ButtonBuilder()
                .setCustomId(`${userid}_emojibutton`)
                .setLabel("Emoji do Botão")
                .setEmoji("<:config_cloud:1213558269633892352>")
                .setStyle(1),
                new ButtonBuilder()
                .setCustomId(`${userid}_mensagemcompra`)
                .setLabel("Voltar")
                .setEmoji("⬅")
                .setStyle(2),
              )
            ]
          })
        }

        async function embed() {
            const embed = await bot.get("mensagem_compra") ?? `${interaction.client.user.username | Produto}`;
           await interaction.update({
                embeds:[
                    new EmbedBuilder().setColor(colorembed)
                    .setTitle(`${interaction.client.user.username} | Personalizar Mensagem de Compra`)
                    .setDescription(`**Título atual:** \`${embed.titulo}\`\n\n**Descrição Atual:** ${embed.desc}\n\n**Rodapé Atual:** \`${embed.rodape}\``)
                    .setFooter({text:"Escolha oque você deseja mudar:",iconURL: interaction.client.user.displayAvatarURL()})
                ],
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_tituloembed`)
                        .setLabel("Título da embed")
                        .setEmoji("<:config_cloud:1213558269633892352>")
                        .setStyle(1),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_descembed`)
                        .setLabel("Descrição da embed")
                        .setEmoji("<:config_cloud:1213558269633892352>")
                        .setStyle(1),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_rodapeembed`)
                        .setLabel("Rodapé da embed")
                        .setEmoji("<:config_cloud:1213558269633892352>")
                        .setStyle(1),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_buttonembed`)
                        .setLabel("Botão da Embed")
                        .setEmoji("<:config_cloud:1213558269633892352>")
                        .setStyle(1),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_resetembed`)
                        .setLabel("Resetar Embed")
                        .setEmoji("<:config_cloud:1213558269633892352>")
                        .setStyle(4),
                    ),
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_voltarpern`)
                        .setStyle(2)
                        .setEmoji("⬅")
                        .setLabel("Voltar")
                    )
                ]
            });
        }

        async function buttonstyle() {
          const style = await bot.get(`mensagem_compra.button.style`);
          let stl = "";
          switch (style) {
            case 1: stl = "`Azul`"
              
              break;
              case 2: stl = "`Cinza`"
                
                break;
                case 3:stl = "`Verde`"
                  
                  break;
                  case 4:stl = "`Vermelho`"
                    
                    break;
          
            default: stl = "`Verde`"
              break;
          }

          return stl

        }

        function resettime() {
            
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(() => {
                interaction.message.edit({
                    content:"⚠️ | Use o Comando Novamente!",
                    components:[],
                    embeds:[],
                    files:[]
                });
            }, 600000);
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