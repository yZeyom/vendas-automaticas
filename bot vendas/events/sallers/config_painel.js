const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, ActivityType, StringSelectMenuBuilder, ChannelSelectMenuBuilder, ChannelType, RoleSelectMenuBuilder } = require("discord.js");
const {bot,carrinho,db,logs,pn,rd,vnd, token, personalizar} = require("../../database/index"); 
let timer;
const axios = require("axios");
const fs = require("fs");
const pd = db;


module.exports = {
    name:"interactionCreate", 
    run: async( interaction, client) => {
        const customId = interaction.customId;
        if(!customId) return;
        const userid = customId.split("_")[0];
        const id = customId.split("_")[1];
        if(!id) return;
        const colorembed = await bot.get("cor");
        const db = pn; 
        const prod = await db.get(`${id}`);
        if(!prod) return;
        if(interaction.user.id !== userid) return; 
        if(customId.endsWith("_attpainelmsg")) {
            resettime();
             const channel = interaction.guild.channels.cache.get(prod.mensagem.channel);
            await interaction.reply({content:`${emoji(44)} | Aguarde um momento...`, ephemeral:true});
            const select = new StringSelectMenuBuilder().setCustomId(`${id}_painel`).setMaxValues(1).setPlaceholder(prod.placeholder);
            await prod.produtos.forEach((pede) => {
                const prod = pd.get(`${pede.id}`);
                if(prod) {
                    select.addOptions(
                        {
                            label:`${prod.nome}`,
                            emoji:`${pede.emoji}`,
                            description:`💸 | Valor: R$${prod.preco} - 📦 | Estoque: ${prod.conta.length}`,
                            value: pede.id
                        }
                    )
                }
            });
            const embed = new EmbedBuilder()
            .setTitle(`${prod.title}`)
            .setDescription(`${prod.desc}`)
            .setColor(prod.corembed);

            if(prod.banner?.startsWith("https://")) {
                embed.setImage(prod.banner);
            }
            if(prod.miniatura?.startsWith("https://")) {
                embed.setThumbnail(prod.miniatura);
            }
            if(prod.rodape !== "Sem Rodapé") {
                embed.setFooter({text:`${prod.rodape}`});
            }
            
            try {
                
           if (channel && channel.messages.fetch(prod.mensagem.msgid)) { 
            
               channel.messages.fetch(prod.mensagem.msgid)
                   .then(async message => {
                       await message.edit({ embeds: [embed],
                        components:[
                            new ActionRowBuilder() 
                            .addComponents(
                                select
                            )
                        ] });
                   })
                   .catch(error => {
                       console.error(`Erro ao editar mensagem: ${error}`);
                   });
           }
           
        } catch {
            interaction.editReply({content:`${emoji(29)} | Ocorreu um erro ao tentar atualizar a mensagem`, ephemeral:true});
        } finally {
            interaction.editReply(`${emoji(11)} | Mensagem Atualizada com sucesso`)
        }
        }
        if(customId.endsWith("_dellpainel")) {
            resettime();
            const modal = new ModalBuilder()
            .setCustomId(`${userid}_${id}_confirmdellpainel`)
            .setTitle("⚙ | Confirmar");

            const text = new TextInputBuilder()
            .setCustomId("text")
            .setStyle(1)
            .setMaxLength(3)
            .setMinLength(3)
            .setLabel("Para continuar escreva \"SIM\"")
            .setPlaceholder("SIM");

            modal.addComponents(new ActionRowBuilder().addComponents(text));

            return interaction.showModal(modal);
        }
        if(customId.endsWith("_confirmdellpainel")) {
            const text = interaction.fields.getTextInputValue("text");
            if(text !== "SIM") return interaction.reply({content:`${emoji(11)} | Cancelado com sucesso`, ephemeral:true});
            await interaction.reply({content:`${emoji(44)} | Aguarde um momento...`, ephemeral:true});
            try {
                await db.delete(`${id}`);
                const channel = interaction.guild.channels.cache.get(prod.mensagem.channel);
                if (channel && channel.messages.fetch(prod.mensagem.msgid)) { 
            
                    channel.messages.fetch(prod.mensagem.msgid)
                        .then(async message => {
                            await message.delete();
                        })
                        .catch(error => {
                            console.error(`Erro ao editar mensagem: ${error}`);
                        });
                }
                interaction.editReply({content:`${emoji(11)} | Deletado com sucesso!`});
                interaction.message.delete();
            } catch(err) {
                interaction.editReply({content:`${emoji(29)} | Ocorreu um erro ao tentar atualizar... \n\n Mensagem do erro: \`${err.message}\``});
            }

            if (timer) clearTimeout(timer);
        }
        if(customId.endsWith("_configembedpainel")) {
            resettime();
            await embedpainel();

        }
        if(customId.endsWith("_voltarpainelslk")) {
            resettime();
            await interaction.update({
                embeds:[
                    new EmbedBuilder()
                    .setTitle(`${interaction.guild.name} | Gerenciar Painel`)
                    .setDescription("Escolha oque deseja gerenciar.")
                    .setFooter({text:`${interaction.guild.name} - Todos os direitos reservados.`, iconURL: interaction.guild.iconURL()})
                ],
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${interaction.user.id}_${id}_configembedpainel`)
                        .setLabel("Configurar Embed")
                        .setStyle(3)
                        .setEmoji("<a:planeta_cloud:1221858904015765524>"),
                        new ButtonBuilder()
                        .setCustomId(`${interaction.user.id}_${id}_configprodpainel`)
                        .setStyle(3)
                        .setEmoji("<:carrin_cloud:1221873043958268045>")
                        .setLabel("Configurar Produtos"),
                    ),
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${interaction.user.id}_${id}_attpainelmsg`)
                        .setStyle(1)
                        .setEmoji("<a:carregando_cloud:1221875082708914362>")
                        .setLabel("Atualizar Painel"),
                        new ButtonBuilder()
                        .setCustomId(`${interaction.user.id}_${id}_dellpainel`)
                        .setStyle(4)
                        .setEmoji("<:lixo_cloud:1221875710956797992>")
                        .setLabel("DELETAR"),
                    )
                ]
            });
        }
        if(customId.endsWith("_titleembedpainel")) {
            resettime();
            const modal = new ModalBuilder()
            .setCustomId(`${userid}_${id}_titleembedmodal`)
            .setTitle(`✏ - Titulo da Embed`);

            const text = new TextInputBuilder()
            .setCustomId("text")
            .setStyle(1)
            .setMaxLength(50)
            .setRequired(true)
            .setLabel("Coloque o Novo Titulo:");

            modal.addComponents(new ActionRowBuilder().addComponents(text));

            return interaction.showModal(modal);
        }
        if(customId.endsWith("_titleembedmodal")) {
            resettime();
            const text = interaction.fields.getTextInputValue("text");
            await db.set(`${id}.title`, text);
            await embedpainel();
        }
        if(customId.endsWith("_rodapeembedpainel")) {
            resettime();
            const modal = new ModalBuilder()
            .setCustomId(`${userid}_${id}_rodapeembedpainelembed`)
            .setTitle(`✏ - Rodapé da Embed`);

            const text = new TextInputBuilder()
            .setCustomId("text")
            .setStyle(1)
            .setMaxLength(50)
            .setRequired(true)
            .setPlaceholder('Caso deseja Remover digite: "remover"')
            .setLabel("Coloque o Novo rodapé:");

            modal.addComponents(new ActionRowBuilder().addComponents(text));

            return interaction.showModal(modal);
        }
        if(customId.endsWith("_rodapeembedpainelembed")) {
            resettime();
            const text = interaction.fields.getTextInputValue("text");
            if(text === "remover") {
                await db.set(`${id}.rodape`, "Sem Rodapé");
                await embedpainel();
                return;
            }
            await db.set(`${id}.rodape`, text);
            await embedpainel();
        }
        if(customId.endsWith("_placeholderembedpainel")) {
            resettime();
            const modal = new ModalBuilder()
            .setCustomId(`${userid}_${id}_placeholderembedpainelmodal`)
            .setTitle(`✏ - roda Embed`);

            const text = new TextInputBuilder()
            .setCustomId("text")
            .setStyle(1)
            .setMaxLength(35)
            .setRequired(true)
            .setLabel("Coloque o Novo Placeholder:");

            modal.addComponents(new ActionRowBuilder().addComponents(text));

            return interaction.showModal(modal);
        }
        if(customId.endsWith("_placeholderembedpainelmodal")) {
            resettime();
            const text = interaction.fields.getTextInputValue("text");
            await db.set(`${id}.placeholder`, text);
            await embedpainel();
        }
        if(customId.endsWith("_descembedpainel")) {
            interaction.update({
                embeds: [
                  new EmbedBuilder().setColor(colorembed)
                  .setTitle(`${interaction.guild.name} | Gerenciar Painel`)
                  .setDescription(`**Descrição Atual:**\n${prod.desc}\nEnvie a nova descrição`)
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
  await db.set(`${id}.desc`, mensagem.content)
  await embedpaineledit();
  
});


const filterBotao = (i) => i.customId.startsWith(userid) && i.customId.endsWith("_cancelled") && i.user.id === interaction.user.id;
const collectorBotao = interaction.channel.createMessageComponentCollector({ filter: filterBotao});


collectorBotao.on("collect", (i) => {
  collectorMensagem.stop();
  collectorBotao.stop("cancelled");
  i.deferUpdate();
  embedpaineledit(); 
});
        }
        if(customId.endsWith("_corembedpainel")) {
            resettime();
            const modal = new ModalBuilder()
            .setCustomId(`${userid}_${id}_corembedmodalpainel`)
            .setTitle("✏ - Cor da Embed");

            const text = new TextInputBuilder()
            .setCustomId("text")
            .setStyle(1)
            .setRequired(true)
            .setLabel("Coloque a Cor da Embed")
            .setPlaceholder("Ex: #000000, Random, Red");

            modal.addComponents(new ActionRowBuilder().addComponents(text));

            return interaction.showModal(modal);
        }
        if(customId.endsWith("_corembedmodalpainel")) {
            resettime();
            const text = interaction.fields.getTextInputValue("text");
            await interaction.reply({content:`🔁 | Verificando a Cor...`, ephemeral:true});
            try {
                await interaction.editReply({
                    content:`${interaction.user}`,
                    embeds:[
                        new EmbedBuilder()
                        .setColor(text)
                        .setDescription(`Nova Cor da Embed: ${text}`)
                    ]
                }).then(async() => {
                    await db.set(`${id}.corembed`, text);
                    await embedpaineledit();
                }).catch(() => {
                    interaction.editReply({content:`⚠️ | Coloque uma cor Valida`});
                })
            } catch {
                interaction.editReply({content:`⚠️ | Coloque uma cor Valida`});
            }
        } //
        if(customId.endsWith("_bannerembedpainel")) {
            resettime();
            const modal = new ModalBuilder()
            .setCustomId(`${userid}_${id}_bannerembedpainelmodal`)
            .setTitle("✏ - Banner da Embed");

            const text = new TextInputBuilder()
            .setCustomId("text")
            .setStyle(1)
            .setRequired(true)
            .setLabel("Coloque a URL da Imagem")
            .setPlaceholder('Caso Deseja retirar digite: "remover"');

            modal.addComponents(new ActionRowBuilder().addComponents(text));

            return interaction.showModal(modal);
        }
        if(customId.endsWith("_bannerembedpainelmodal")) {
            resettime();
            const text = interaction.fields.getTextInputValue("text");
            if(text === "remover") {
                await db.set(`${id}.banner`, text);
                await embedpainel();
                return;
            }
            await interaction.reply({content:`${emoji(44)} | Verificando a imagem...`, ephemeral:true});
            try {
                await interaction.editReply({
                    content:`${interaction.user}`,
                    embeds:[
                        new EmbedBuilder()
                        .setImage(text)
                        .setDescription(`Nova Imagem:`)
                    ]
                }).then(async() => {
                    await db.set(`${id}.banner`, text);
                    await embedpaineledit();
                }).catch(() => {
                    interaction.editReply({content:`${emoji(29)} | Coloque uma imagem Valida`});
                })
            } catch {
                interaction.editReply({content:`${emoji(29)} | Coloque uma imagem Valida`});
            }
        } //
        if(customId.endsWith("_thumbnailembedpainel")) {
            resettime();
            const modal = new ModalBuilder()
            .setCustomId(`${userid}_${id}_thumbnailembedpainelmodal`)
            .setTitle("✏ - Thumbnail da Embed");

            const text = new TextInputBuilder()
            .setCustomId("text")
            .setStyle(1)
            .setRequired(true)
            .setLabel("Coloque a URL da Imagem")
            .setPlaceholder('Caso Deseja retirar digite: "remover"');

            modal.addComponents(new ActionRowBuilder().addComponents(text));

            return interaction.showModal(modal);
        }
        if(customId.endsWith("_thumbnailembedpainelmodal")) {
            resettime();
            const text = interaction.fields.getTextInputValue("text");
            if(text === "remover") {
                await db.set(`${id}.miniatura`, text);
                await embedpainel();
                return;
            }
            await interaction.reply({content:`${emoji(44)} | Verificando a imagem...`, ephemeral:true});
            try {
                await interaction.editReply({
                    content:`${interaction.user}`,
                    embeds:[
                        new EmbedBuilder()
                        .setImage(text)
                        .setDescription(`Nova Imagem:`)
                    ]
                }).then(async() => {
                    await db.set(`${id}.miniatura`, text);
                    await embedpaineledit();
                }).catch(() => {
                    interaction.editReply({content:`${emoji(29)} | Coloque uma imagem Valida`});
                })
            } catch {
                interaction.editReply({content:`${emoji(29)} | Coloque uma imagem Valida`});
            }
        }
        if(customId.endsWith("_configprodpainel")) {
            resettime();
            await configpd();
        }
        if(customId.endsWith("_addproductpainel")) {
            resettime();
            const modal = new ModalBuilder()
            .setCustomId(`${userid}_${id}_addprodpainelmodal`)
            .setTitle(`➕ - Adicionar Produto ao Painel`);

            const text = new TextInputBuilder()
            .setCustomId("text")
            .setLabel("coloque o id do produto:")
            .setStyle(1)
            .setRequired(true);

            modal.addComponents(new ActionRowBuilder().addComponents(text));

            return interaction.showModal(modal);
        }
        if(customId.endsWith("_addprodpainelmodal")) {
            resettime();
            const text = interaction.fields.getTextInputValue("text");
            const p = await pd.get(`${text}`);
            if(!p) return interaction.reply({content:`${emoji(2)} | Não Existe nenhum produto com esse ID`, ephemeral:true});
            if(prod.produtos.some(a => a.id === text)) return interaction.reply({content:`❌ | Este Produto ja foi cadastrado no Painel`, ephemeral:true});
            await db.push(`${id}.produtos`, {
                id: text,
                emoji:`${personalizar.get("14")}`
            }); 
            await configpd();
        }
        if(customId.endsWith("_removeproductpainel")) {
            resettime();
            const modal = new ModalBuilder()
            .setCustomId(`${userid}_${id}_removeproductpainelmodal`)
            .setTitle(`➖ - Remover Produto ao Painel`);

            const text = new TextInputBuilder()
            .setCustomId("text")
            .setLabel("coloque o id do produto:")
            .setStyle(1)
            .setRequired(true);

            modal.addComponents(new ActionRowBuilder().addComponents(text));

            return interaction.showModal(modal);
        }
        if(customId.endsWith("_removeproductpainelmodal")) {
            resettime();
            const text = interaction.fields.getTextInputValue("text");
            const p = await pd.get(`${text}`);
            if (!p) return interaction.reply({content:`${emoji(2)} | Não Existe nenhum produto com esse ID`, ephemeral:true});
            if (!prod.produtos.some(a => a.id === text)) return interaction.reply({content:`${emoji(2)} | Este Produto não foi cadastrado no Painel`, ephemeral:true});
            await db.pull(`${id}.produtos`, (element, index, array) => element.id === text, true);
            await configpd();            
        }
        if (customId.endsWith("_altemojipainel")) {
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
        
                const emojiverification = interaction.client.emojis.cache.find(emoji => `<:${emoji.name}:${emoji.id}>` === emojis) || interaction.client.emojis.cache.find(emoji => `<a:${emoji.name}:${emoji.id}>` === emojis) || interaction.client.emojis.cache.find(emoji => emoji.name === emojis) || interaction.client.emojis.cache.get(emojis);
        
                const emojiRegex = require("emoji-regex");
                function emojiverification2(str) {
                    const emojiPattern = emojiRegex();
                    const emojis = str.match(emojiPattern) || [];
                      
                    return emojis.length === 1;
                }
        
                if (!emojiverification && !emojiverification2(`${emojis}`)) {
                    await interaction.followUp({
                        ephemeral: true,
                        content: `${emoji(2)} | Coloque um emoji Valido!`
                    });
                    configpdedit();
                    return;
                }
        
                
                const index = prod.produtos.findIndex(item => item.id === `${interaction.values[0]}`);

                
        if (index !== -1) {
            
            prod.produtos[index].emoji = emojis;

            
            db.set(`${id}.produtos`, prod.produtos);
        }
        
                configpdedit();
            });
        
            const filterBotao = (i) => i.customId.startsWith(userid) && i.customId.endsWith("_cancelled") && i.user.id === interaction.user.id;
            const collectorBotao = interaction.channel.createMessageComponentCollector({ filter: filterBotao });
        
            collectorBotao.on("collect", (i) => {
                collectorMensagem.stop();
                collectorBotao.stop("cancelled");
                i.deferUpdate();
                configpdedit();
            });
        } 

        async function embedpainel() {
            const prod = await db.get(`${id}`);
            let banner = "Sem Banner";
            if(prod.banner?.startsWith("https://")) { // oq?
                banner = `[Banner](${prod.banner})`
            }
            let miniatura = "Sem Miniatura";
            if(prod.miniatura?.startsWith("https://")) {
                miniatura = `[Miniatura](${prod.miniatura})`
            }
            await interaction.update({
                embeds:[
                    new EmbedBuilder()
                    .setTitle(`Titulo Atual: ${prod.title}`)
                    .setColor(colorembed)
                    .setFooter({text:`Rodapé Atual: ${prod.rodape}`})
                    .setDescription(`📝 **| Descrição Atual:**\n${prod.desc} \n\n🎨 | Cor da Embed: ${prod.corembed} \n📒 | Texto do Place Holder: ${prod.placeholder}\n📂 | Banner: ${banner} \n🖼️ | Miniatura: ${miniatura}`)
                ], 
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setLabel("Título da embed")
                        .setStyle(1)
                        .setEmoji("<:config_cloud:1213558269633892352>")
                        .setCustomId(`${userid}_${id}_titleembedpainel`),
                        new ButtonBuilder()
                        .setLabel("Descrição da embed")
                        .setStyle(1)
                        .setEmoji("<:config_cloud:1213558269633892352>")
                        .setCustomId(`${userid}_${id}_descembedpainel`),
                        new ButtonBuilder()
                        .setLabel("Rodapé da embed")
                        .setStyle(1)
                        .setEmoji("<:config_cloud:1213558269633892352>")
                        .setCustomId(`${userid}_${id}_rodapeembedpainel`),
                        new ButtonBuilder()
                        .setLabel("Place Holder")
                        .setStyle(1)
                        .setEmoji("<:config_cloud:1213558269633892352>")
                        .setCustomId(`${userid}_${id}_placeholderembedpainel`),
                        new ButtonBuilder()
                        .setLabel("Cor Embed")
                        .setStyle(1)
                        .setEmoji("🖌")
                        .setCustomId(`${userid}_${id}_corembedpainel`),
                    ),
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setStyle(1)
                        .setLabel("Banner")
                        .setEmoji("🖼")
                        .setCustomId(`${userid}_${id}_bannerembedpainel`),
                        new ButtonBuilder()
                        .setStyle(1)
                        .setLabel("Miniatura")
                        .setEmoji("🖼")
                        .setCustomId(`${userid}_${id}_thumbnailembedpainel`),
                        new ButtonBuilder()
                        .setCustomId(`${interaction.user.id}_${id}_attpainelmsg`)
                        .setStyle(1)
                        .setEmoji("<a:carregando_cloud:1221875082708914362>")
                        .setLabel("Atualizar Painel"),
                        new ButtonBuilder()
                        .setStyle(1) 
                        .setLabel("Voltar")
                        .setEmoji("⬅")
                        .setCustomId(`${userid}_${id}_voltarpainelslk`),
                    )
                ]
            })
        }
        async function embedpaineledit() {
            const prod = await db.get(`${id}`);
            let banner = "Sem Banner";
            if(prod.banner?.startsWith("https://")) { // oq?
                banner = `[Banner](${prod.banner})`
            }
            let miniatura = "Sem Miniatura";
            if(prod.miniatura?.startsWith("https://")) {
                miniatura = `[Miniatura](${prod.miniatura})`
            }
            await interaction.message.edit({
                embeds:[
                    new EmbedBuilder()
                    .setTitle(`Titulo Atual: ${prod.title}`)
                    .setColor(colorembed)
                    .setFooter({text:`Rodapé Atual: ${prod.rodape}`})
                    .setDescription(`📝 **| Descrição Atual:**\n${prod.desc} \n\n🎨 | Cor da Embed: ${prod.corembed} \n📒 | Texto do Place Holder: ${prod.placeholder}\n📂 | Banner: ${banner} \n🖼️ | Miniatura: ${miniatura}`)
                ], 
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setLabel("Título da embed")
                        .setStyle(1)
                        .setEmoji("<:config_cloud:1213558269633892352>")
                        .setCustomId(`${userid}_${id}_titleembedpainel`),
                        new ButtonBuilder()
                        .setLabel("Descrição da embed")
                        .setStyle(1)
                        .setEmoji("<:config_cloud:1213558269633892352>")
                        .setCustomId(`${userid}_${id}_descembedpainel`),
                        new ButtonBuilder()
                        .setLabel("Rodapé da embed")
                        .setStyle(1)
                        .setEmoji("<:config_cloud:1213558269633892352>")
                        .setCustomId(`${userid}_${id}_rodapeembedpainel`),
                        new ButtonBuilder()
                        .setLabel("Place Holder")
                        .setStyle(1)
                        .setEmoji("<:config_cloud:1213558269633892352>")
                        .setCustomId(`${userid}_${id}_placeholderembedpainel`),
                        new ButtonBuilder()
                        .setLabel("Cor Embed")
                        .setStyle(1)
                        .setEmoji("🖌")
                        .setCustomId(`${userid}_${id}_corembedpainel`),
                    ),
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setStyle(1)
                        .setLabel("Banner")
                        .setEmoji("🖼")
                        .setCustomId(`${userid}_${id}_bannerembedpainel`),
                        new ButtonBuilder()
                        .setStyle(1)
                        .setLabel("Miniatura")
                        .setEmoji("🖼")
                        .setCustomId(`${userid}_${id}_thumbnailembedpainel`),
                        new ButtonBuilder()
                        .setCustomId(`${interaction.user.id}_${id}_attpainelmsg`)
                        .setStyle(1)
                        .setEmoji("<a:carregando_cloud:1221875082708914362>")
                        .setLabel("Atualizar Painel"),
                        new ButtonBuilder()
                        .setStyle(1) 
                        .setLabel("Voltar")
                        .setEmoji("⬅")
                        .setCustomId(`${userid}_${id}_voltarpainelslk`),
                    )
                ]
            })
        }
        async function configpd() {
            const prod = await db.get(`${id}`);
            const select = new StringSelectMenuBuilder().setCustomId(`${userid}_${id}_altemojipainel`).setPlaceholder("Selecione um Produto para alterar o Emoji").setMaxValues(1);
            let msg = "";
            prod.produtos.map((pede, index) => {
                const prud = pd.get(`${pede.id}`);
                msg += `${pede.emoji}** | __${index + 1}°__ - 📦 | ID:** ${pede.id}\n`;
                select.addOptions(
                    {
                        label:`${prud.nome}`,
                        description:`💸 | Valor: R$${prud.preco} - 📦 | Estoque: ${prud.conta.length}`,
                        value:`${pede.id}`,
                        emoji:`${pede.emoji}`
                    }
                )
            })
            await interaction.update({
                embeds:[
                    new EmbedBuilder()
                    .setColor(colorembed)
                    .setTitle(`Estes são os produtos cadastrados no Painel:`)
                    .setDescription(`${msg}`)
                    .setFooter({text:`Caso queira trocar o emoji de algum produto, selecione no select menu abaixo:`})
                ],
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_${id}_addproductpainel`)
                        .setStyle(3)
                        .setDisabled(prod.produtos.length > 24)
                        .setEmoji("<:mais_cloud:1213643443897634956>")
                        .setLabel("Adicionar Produto"),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_${id}_removeproductpainel`)
                        .setStyle(2)
                        .setDisabled(prod.produtos.length <= 1)
                        .setEmoji("<:menos_cloud:1213652114891604039>")
                        .setLabel("Remover Produto"),
                    ),
                    new ActionRowBuilder()
                    .addComponents(
                        select
                    ),
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${interaction.user.id}_${id}_attpainelmsg`)
                        .setStyle(1)
                        .setEmoji("<a:carregando_cloud:1221875082708914362>")
                        .setLabel("Atualizar Painel"),
                        new ButtonBuilder()
                        .setStyle(1) 
                        .setLabel("Voltar")
                        .setEmoji("⬅")
                        .setCustomId(`${userid}_${id}_voltarpainelslk`),
                    )
                ]
            })

        }
        async function configpdedit() {
            const prod = await db.get(`${id}`);
            const select = new StringSelectMenuBuilder().setCustomId(`${userid}_${id}_altemojipainel`).setPlaceholder("Selecione um Produto para alterar o Emoji").setMaxValues(1);
            let msg = "";
            prod.produtos.map((pede, index) => {
                const prud = pd.get(`${pede.id}`);
                msg += `${pede.emoji}** | __${index + 1}°__ - 📦 | ID:** ${pede.id}\n`;
                select.addOptions(
                    {
                        label:`${prud.nome}`,
                        description:`💸 | Valor: R$${prud.preco} - 📦 | Estoque: ${prud.conta.length}`,
                        value:`${pede.id}`,
                        emoji:`${pede.emoji}`
                    }
                )
            })
            await interaction.message.edit({
                embeds:[
                    new EmbedBuilder()
                    .setColor(colorembed)
                    .setTitle(`Estes são os produtos cadastrados no Painel:`)
                    .setDescription(`${msg}`)
                    .setFooter({text:`Caso queira trocar o emoji de algum produto, selecione no select menu abaixo:`})
                ],
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_${id}_addproductpainel`)
                        .setStyle(3)
                        .setDisabled(prod.produtos.length > 24)
                        .setEmoji("<:mais_cloud:1213643443897634956>")
                        .setLabel("Adicionar Produto"),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_${id}_removeproductpainel`)
                        .setStyle(2)
                        .setDisabled(prod.produtos.length <= 1)
                        .setEmoji("<:menos_cloud:1213652114891604039>")
                        .setLabel("Remover Produto"),
                    ),
                    new ActionRowBuilder()
                    .addComponents(
                        select
                    ),
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${interaction.user.id}_${id}_attpainelmsg`)
                        .setStyle(1)
                        .setEmoji("<a:carregando_cloud:1221875082708914362>")
                        .setLabel("Atualizar Painel"),
                        new ButtonBuilder()
                        .setStyle(1) 
                        .setLabel("Voltar")
                        .setEmoji("⬅")
                        .setCustomId(`${userid}_${id}_voltarpainelslk`),
                    )
                ]
            })

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