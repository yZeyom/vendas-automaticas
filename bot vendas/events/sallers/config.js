const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, ActivityType, StringSelectMenuBuilder, ChannelSelectMenuBuilder, ChannelType, RoleSelectMenuBuilder } = require("discord.js");
const {bot,carrinho,db,logs,pn,rd,vnd, token, personalizar} = require("../../database/index"); 
let timer;
const axios = require("axios");
const fs = require("fs");
module.exports = {
    name:"interactionCreate", 
    run: async( interaction, client) => {
        const customId = interaction.customId;
        if(!customId) return;
        const userid = customId.split("_")[0];
        const id = customId.split("_")[1];
        const custom = customId.split("_")[2];
        const colorembed = await bot.get("cor");
        
        if(!custom) return;
        if(id === null || id === "") return;
        
        const prod = await db.get(`${id}`);
        if(!prod) return; 

        if(custom === "mudarnomeprod") {
            resettime();
            const modal = new ModalBuilder()
            .setCustomId(`${userid}_${id}_mudarnomemodal`)
            .setTitle("🔧 | Alterar Nome do Produto");

            const text = new TextInputBuilder()
            .setCustomId("text")
            .setLabel("Novo Nome: ")
            .setStyle(1)
            .setRequired(true);

            modal.addComponents(new ActionRowBuilder().addComponents(text));

            return interaction.showModal(modal);
        }
        if(custom === "mudarnomemodal") {
            resettime();
            const text = interaction.fields.getTextInputValue("text");
            await db.set(`${id}.nome`, text);
            await embed();
        }
        if(custom === "mudarprecoprod") {
            resettime();
            const modal = new ModalBuilder()
            .setCustomId(`${userid}_${id}_precoalterarmodal`)
            .setTitle("🔧 | Alterar Preço do Produto");

            const text = new TextInputBuilder()
            .setCustomId("text")
            .setLabel("NOVO PREÇO: ")
            .setStyle(1)
            .setPlaceholder("Ex: 5.50")
            .setRequired(true);

            modal.addComponents(new ActionRowBuilder().addComponents(text));

            return interaction.showModal(modal);


        }
        if(custom === "precoalterarmodal") {
            resettime();
            const text = parseFloat(interaction.fields.getTextInputValue("text"));
            if(text <= 0) return interaction.reply({content:`⚠ | Coloque um valor acima de 0`, ephemeral:true});
            if(isNaN(text)) return interaction.reply({content:`⚠ | Coloque um Valor Valido`, ephemeral:true});
            await db.set(`${id}.preco`, Number(text).toFixed(2));
            await embed();
        }
        if(custom === "mudardescprod") {
            resettime();
            const modal = new ModalBuilder()
            .setCustomId(`${userid}_${id}_descmodalmudar`)
            .setTitle("🔧 | Alterar Descrição do Produto");

            const text = new TextInputBuilder()
            .setCustomId("text")
            .setLabel("NOVA DESCRIÇÃO: ")
            .setStyle(2)
            .setMaxLength(4000)
            .setValue(`${prod.desc}`)
            .setRequired(true);

            modal.addComponents(new ActionRowBuilder().addComponents(text));

            return interaction.showModal(modal);


        }
        if(custom === "descmodalmudar") {
            resettime();
            const text = interaction.fields.getTextInputValue("text");
            await db.set(`${id}.desc`, text)
            await embed();
        }

        if(custom === "deleteprod") {
            const modal = new ModalBuilder()
            .setCustomId(`${userid}_${id}_confirmdeleteprod`)
            .setTitle(`⚙ | Confirmar`);

            const text = new TextInputBuilder()
            .setCustomId("text")
            .setLabel("Para continuar escreva \"SIM\"")
            .setStyle(1)
            .setMaxLength(3)
            .setMinLength(3)
            .setRequired(true)
            .setPlaceholder("SIM");

            modal.addComponents(new ActionRowBuilder().addComponents(text));

            return interaction.showModal(modal);
        }
        if(custom === "mudarestoqueprod") {
            resettime();
            stock();
        }
        if(custom === "confirmdeleteprod") {
            const text = interaction.fields.getTextInputValue("text");
            if(text !== "SIM") return interaction.reply({content:`${emoji(11)} | Cancelado!`, ephemeral:true});
            await interaction.reply({content:`${emoji(44)} | Aguarde um momento...`, ephemeral:true});

            await db.delete(`${id}`);
            interaction.message.edit({
                content:``,
                embeds:[
                    new EmbedBuilder()
                    .setDescription(`${emoji(11)} | O produto Não configurado ainda... foi deletado com sucesso!`)
                    .setColor(colorembed) 
                ],
                components:[]
            })
            await interaction.editReply({content:`${emoji(11)} | O produto ${prod.nome} foi deletado com sucesso!`})

        }

        if(custom === "voltarprod") {
            resettime();
            await embed();
        }
        if(customId.endsWith("_adestoquerep")) {
            resettime();
            const modal = new ModalBuilder()
            .setCustomId(`${userid}_${id}_stockrepmodal`)
            .setTitle("🔧 | Alterar Estoque Repetido");

            const text = new TextInputBuilder()
            .setCustomId("text")
            .setLabel("Produto:")
            .setStyle(2)
            .setRequired(true)
            .setPlaceholder("Ex: Obrigado pela compra, favor abrir ticket para receber seu produto!")
            .setMaxLength(4000);

            const text1 = new TextInputBuilder()
            .setCustomId("text1")
            .setLabel("quantidade:")
            .setStyle(1)
            .setMaxLength(3)
            .setPlaceholder("Ex: 10");

            modal.addComponents(new ActionRowBuilder().addComponents(text));
            modal.addComponents(new ActionRowBuilder().addComponents(text1));

            return interaction.showModal(modal);
        }
        if(customId.endsWith("_stockrepmodal")) {
            const text = `${interaction.fields.getTextInputValue("text")}`
            const rept = parseInt(interaction.fields.getTextInputValue("text1"));

            if(isNaN(rept)) return interaction.reply({content:`${emoji(2)} | Coloque Algum numero valido!`, ephemeral:true})
            
            const delimiter = "<unique_delimiter>"; 
            const repeatedText = (text + delimiter).repeat(Number(rept));
            const array = repeatedText.split(delimiter);
            array.pop(); 
            array.map((a) => {
                db.push(`${id}.conta`, a)
            })
            await stock();
            interaction.followUp({content:`${emoji(11)} | Foram Adicionados: \`${rept}\` produto repetidos.`, ephemeral:true});
            chm(rept);
        }
        if(custom === "addstockprod") {
            resettime();
            interaction.update({
                embeds:[
                    new EmbedBuilder()
                    .setColor(colorembed)
                    .setDescription(`${emoji(12)} | Você deseja adicionar diversos produtos de uma vez ou enviar um por um?`)
                ],
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_${id}_addlinhaprod`)
                        .setLabel("ADICIONAR POR LINHA")
                        .setEmoji("<:folha_cloud:1221870992817782936>")
                        .setStyle(3), 
                        new ButtonBuilder()
                        .setCustomId(`${userid}_${id}_addlinhatxt`)
                        .setLabel("ADICIONAR POR LINHA VIA TXT")
                        .setEmoji("📁")
                        .setStyle(3), 
                    ),
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_${id}_adestoquerep`)
                        .setLabel("ADICIONAR ESTOQUE REPETIDO")
                        .setEmoji("<:info_startcommunity:1193797249612922982>")
                        .setStyle(1),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_${id}_addumporumprod`)
                        .setLabel("ADICIONAR UM POR UM")
                        .setEmoji("<:mais_cloud:1213643443897634956>")
                        .setStyle(2),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_${id}_mudarestoqueprod`)
                        .setLabel("Voltar")
                        .setStyle(2)
                        .setEmoji("⬅"),
                    )
                ]
            })
        }
        if(custom === "addlinhaprod") {
            resettime();
            const modal = new ModalBuilder()
            .setCustomId(`${userid}_${id}_addstockmodal`)
            .setTitle("🔧 | Adicionar Estoque");

            const text = new TextInputBuilder()
            .setCustomId("text")
            .setLabel("ADICIONE O ESTOQUE POR LINHA:")
            .setStyle(2)
            .setMaxLength(4000)
            .setPlaceholder("Ex: \nProduto1 \nProduto2 \nProduto3 \nProduto4")
            .setRequired(true);

            modal.addComponents(new ActionRowBuilder().addComponents(text));

            return interaction.showModal(modal);
        }

        if(custom === "addstockmodal"){
            resettime();
            const text = interaction.fields.getTextInputValue("text");
            const array = text.split("\n");
            let asd = 0;
            await array.map((conts) => {
                if(conts !== null && conts !== '') {
                    asd++;
                    db.push(`${id}.conta`, conts);
                }
            });

            await stock();
            await interaction.followUp({content:`${emoji(11)} | Foram adicionados \`${asd}\` Produtos`, ephemeral:true})
            chm(asd)
            
        }
        if(custom === "addumporumprod") {
            resettime();
            interaction.update({embeds:[
                new EmbedBuilder()
                .setColor(colorembed)
                .setDescription(`${emoji(12)} | Envie o produto de um em um, quando terminar de enviar aperte no botão abaixo:`)
            ],
            components:[
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId(`${userid}_cancelled`)
                    .setLabel("Finalizar")
                    .setEmoji("<a:Sim:1194533896277217300>")
                    .setStyle(3)
                )
            ]
        })
            const filterMensagem = (msg) => msg.author.id === interaction.user.id;
            const collectorMensagem = interaction.channel.createMessageCollector({ filter: filterMensagem });
          
            let count = 0;
            collectorMensagem.on("collect", async (mensagem) => {
              await mensagem.delete();
              const emojis = mensagem.content;
              await db.push(`${id}.conta`, emojis);
              count++;
            });
          
            
            const filterBotao = (i) => i.customId.startsWith(userid) && i.customId.endsWith("_cancelled") && i.user.id === interaction.user.id;
            const collectorBotao = interaction.channel.createMessageComponentCollector({ filter: filterBotao});
          
            
            collectorBotao.on("collect", (i) => {
              collectorMensagem.stop();
              collectorBotao.stop("cancelled");
              i.deferUpdate();
              stockedit();
              interaction.followUp({content:`${emoji(11)} | Foram adicionados \`${count}\` Produtos`, ephemeral:true});
              chm(count)
            });
        }
        if (customId.endsWith("_addlinhatxt")) {
            resettime();
            interaction.update({
                embeds: [
                    new EmbedBuilder()
                        .setColor(colorembed)
                        .setDescription(`${emoji(12)} | Envie o arquivo .txt contendo os produtos.`)
                ],
                components: [
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId(`${userid}_cancelled`)
                                .setLabel("Finalizar")
                                .setEmoji("<a:sim_cloud:1221871466899832995>")
                                .setStyle(3)
                        )
                ]
            })
        
            const filterArquivo = (msg) => msg.author.id === interaction.user.id && msg.attachments.size > 0 && msg.attachments.first().name.endsWith(".txt");
            const collectorArquivo = interaction.channel.createMessageCollector({ filter: filterArquivo });
        
            collectorArquivo.on("collect", async (mensagem) => {
                const attachment = mensagem.attachments.first();
                const fileContent = await downloadFile(attachment.url); 
                mensagem.delete();
                const lines = fileContent.split('\n');
        
                let count = 0;
                for (const line of lines) {
                    if(line.trim() !== null && line.trim() !== "" && line.trim() !== " ") {
                        await db.push(`${id}.conta`, line.trim());
                        count++;
                    }
                }
        
                collectorArquivo.stop();
                stockedit();
                interaction.followUp({ content: `${emoji(11)} | Foram adicionados \`${count}\` Produtos`, ephemeral: true });
                chm(count);
            });
        
            const filterBotao = (i) => i.customId.startsWith(userid) && i.customId.endsWith("_cancelled") && i.user.id === interaction.user.id;
            const collectorBotao = interaction.channel.createMessageComponentCollector({ filter: filterBotao });
        
            collectorBotao.on("collect", (i) => {
                collectorArquivo.stop();
                collectorBotao.stop("cancelled");
                i.deferUpdate();
                stockedit();
                interaction.followUp({ content: `${emoji(11)} | Adição de Produtos cancelada.`, ephemeral: true });
            });
        }

        
        if(custom === "removestockprod") {
            resettime();
            const modal = new ModalBuilder()
            .setCustomId(`${userid}_${id}_removestockmodal`)
            .setTitle("🔧 | Remover");

            const text = new TextInputBuilder()
            .setCustomId("text")
            .setLabel("Coloque o número da linha do produto:")
            .setStyle(1)
            .setPlaceholder("Ex: 1")
            .setMaxLength(4000);

            modal.addComponents(new ActionRowBuilder().addComponents(text));

            return interaction.showModal(modal);
        }

        if(custom === "removestockmodal") {
            resettime();
            const text = parseInt(interaction.fields.getTextInputValue("text"));
            if(isNaN(text)) return interaction.reply({content:`❌ | Error: Valor inválido!`, ephemeral:true});
            if(text < 0) return interaction.reply({content:`❌ | Error: Valor inválido!`, ephemeral:true});
            const stock = await db.get(`${id}.conta`);
            if(Number(text) > stock.length) return interaction.reply({content:`❌ | Error: Item não encontrado!`, ephemeral:true});
            try{
                const a = await db.get(`${id}.conta`);
                const removedItem = a.splice(Number(text), 1)[0]; 
                await db.set(`${id}.conta`, a);
                await interaction.deferUpdate();
                await stockedit();
                } catch (err){
                    interaction.reply({
                        content:`❌ | Aconteceu um erro: \n${err.message}`,
                        ephemeral:true
                    }); 
                }
            

        }
        if(custom === "backupstockprod") {
            resettime();
            await interaction.reply({
                content:`${emoji(44)} | Aguarde um Momento estou fazendo Backup..`,
                ephemeral:true
            });
            try {
                setTimeout(() => {
                var contas = `${db.get(`${id}.conta`)}`.split(',');
        
            const backupItems = contas.map((item, index) => `${index} | - ${item}`);
            var backup = `Aqui o seu estoque:\n\n${backupItems.join('\n')}`; 
        
            fs.writeFile('estoque.txt', backup, (err) => {
                if (err) throw err;
        
                interaction.editReply({
                    content:`${emoji(11)} | Aqui está o Backup do ProdutoID: ${id}`,
                    files: [{
                        attachment: 'estoque.txt',
                        name: 'estoque.txt'
                    }]
                }).then(() => {
                  
                    fs.unlink('estoque.txt', (err) => {
                        if (err) throw err;
                    });
                }).catch(err => {
                    console.error('Erro ao enviar o arquivo:', err);
                });
            });
                
            }, );
        } catch {
            interaction.editReply({content:`${emoji(29)} | Ocorreu um erro ao tentar fazer backup do produtoID: ${id}`});
        }
        }
        if(custom === "cleanstockprod") {
            resettime();
            const modal = new ModalBuilder()
            .setCustomId(`${userid}_${id}_cleanstockmodal`)
            .setTitle("⚙ | Confirmar");

            const text = new TextInputBuilder()
            .setCustomId("text")
            .setStyle(1)
            .setMaxLength(3)
            .setMinLength(3)
            .setPlaceholder("SIM")
            .setLabel("para continuar escreva \"SIM\"");

            modal.addComponents(new ActionRowBuilder().addComponents(text));

            return interaction.showModal(modal);
        }

        if(custom === "cleanstockmodal") {
            resettime();
            const text = interaction.fields.getTextInputValue("text");
            if(text !== "SIM") return interaction.reply({content:`${emoji(11)} | Cancelado!`, ephemeral:true});
            await interaction.deferUpdate();
            const stock = await db.get(`${id}.conta`, []);
            await db.set(`${id}.conta`, []);
            stockedit();
            interaction.followUp({content:`${emoji(11)} | Foram Removidos \`${stock.length}\` Produtos`,ephemeral:true});
        }
        if(custom === "attmsgprod") {
            resettime();
             const channel = interaction.guild.channels.cache.get(prod.mensagem.channel);
            await interaction.reply({content:`${emoji(44)} | Aguarde um momento...`, ephemeral:true});
            try {const embed = new EmbedBuilder()
                .setColor(await bot.get(`cor`));
    
                let title = await bot.get("mensagem_compra.titulo");    
                title = title.replace("#{nome}", prod.nome);
                title = title.replace("#{preco}", Number(prod.preco).toFixed(1));
                title = title.replace("#{estoque}", prod.conta.length);
                embed.setTitle(`${title}`);
                let desc = await bot.get("mensagem_compra.desc");
                desc = desc.replace("#{nome}", prod.nome);
                desc = desc.replace("#{preco}", Number(prod.preco).toFixed(2));
                desc = desc.replace("#{estoque}", prod.conta.length);
                desc = desc.replace("#{desc}", prod.desc);
                embed.setDescription(desc);
                const mensagem_compra = await bot.get("mensagem_compra");
    
                if(prod.banner.startsWith("https://")) {
                    embed.setImage(prod.banner);
                }
                if(prod.miniatura.startsWith("https://")) {
                    embed.setThumbnail(prod.miniatura);
                }
                if(prod.rodape !== "Sem Rodapé") {
                    embed.setFooter({text:`${prod.rodape}`})
                }
                const row = 
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId(`${id}_produto`)
                    .setLabel(`${mensagem_compra.button.text}` ?? "Comprar")
                    .setStyle(Number(mensagem_compra.button.style) ?? 3)
                    .setEmoji(`${mensagem_compra.button.emoji}` ?? "<:Carrinho_black:1178025995488464979>")
                );
                const duvidas = await bot.get("duvidas");
                if(duvidas.status) {
                    const channel = interaction.guild.channels.cache.get(duvidas.channel) || interaction.channel;
                    row.addComponents(
                        new ButtonBuilder()
                        .setStyle(5)
                        .setLabel(duvidas.label)
                        .setEmoji(duvidas.emoji)
                        .setURL(channel.url) // blz
                    );
                }
           if (channel && channel.messages.fetch(prod.mensagem.msgid)) {
            
               channel.messages.fetch(prod.mensagem.msgid)
                   .then(async message => {
                       await message.edit({ embeds: [embed],
                        components:[
                            row
                        ] });
                   })
                   .catch(error => {
                       console.error(`Erro ao editar mensagem: ${error}`);
                   });
           }
           
        } catch {
            interaction.editReply({content:`⚠ | Ocorreu um erro ao tentar atualizar a mensagem`, ephemeral:true});
        } finally {
            interaction.editReply(`${emoji(11)} | Mensagem Atualizada com sucesso`)
        }
           
        }
        if(custom === "configadvprod") {
            resettime();
            await config();
        }
        if(customId.endsWith("_bannerprodtrocar")){
            resettime();
            const modal = new ModalBuilder()
            .setTitle("🔧 | Alterar Banner Padrão")
            .setCustomId(`${userid}_${id}_bannerprodmodal`);

            const text = new TextInputBuilder()
            .setCustomId("text")
            .setLabel("LINK DO NOVO BANNER")
            .setStyle(1)
            .setRequired(true)
            .setPlaceholder("Caso queira remover, digite: \"remover\"");

            modal.addComponents(new ActionRowBuilder().addComponents(text));

            return interaction.showModal(modal);
        }            
        if(customId.endsWith("_miniaturaprodtrocar")){
            resettime();
            const modal = new ModalBuilder()
            .setTitle("🔧 | Alterar Miniatura Padrão")
            .setCustomId(`${userid}_${id}_miniaturaprodmodal`);

            const text = new TextInputBuilder()
            .setCustomId("text")
            .setLabel("LINK DA NOVA MINIATURA")
            .setStyle(1)
            .setRequired(true)
            .setPlaceholder("Caso queira remover, digite: \"remover\"");

            modal.addComponents(new ActionRowBuilder().addComponents(text));

            return interaction.showModal(modal);
        }

        
        if(customId.endsWith("_miniaturaprodmodal")) {
            resettime();
            const text = interaction.fields.getTextInputValue("text");
            if(text === "remover") {
                await db.set(`${id}.miniatura`, "Não Configurado");
                interaction.reply({
                    content:`${emoji(11)} | Miniatura removido!`,
                    ephemeral:true,
                });
                await configmsg();

                return;
            }
            try {
                interaction.reply({
                    content:`${interaction.user}`,
                    embeds:[
                        new EmbedBuilder()
                        .setDescription("${emoji(11)} | Miniatura alterado")
                        .setImage(text)
                    ],
                    ephemeral:true
                }).then(async() => {
                    await db.set(`${id}.miniatura`, text);
                    configmsg();
                }).catch(() => {
                    interaction.reply({content:`${emoji(29)} | Miniatura inválido!`, ephemeral:true})
                })
            } catch{ 
                interaction.reply({content:`${emoji(29)} | Miniatura inválido!`, ephemeral:true})
            }

        }
        if(customId.endsWith("_bannerprodmodal")) {
            resettime();
            const text = interaction.fields.getTextInputValue("text");
            if(text === "remover") {
                await db.set(`${id}.banner`, "Não Configurado");
                interaction.reply({
                    content:`${emoji(11)} | Banner removido!`,
                    ephemeral:true,
                });
                await configmsg();

                return;
            }
            try {
                interaction.reply({
                    content:`${interaction.user}`,
                    embeds:[
                        new EmbedBuilder()
                        .setDescription(`${emoji(11)} | Banner alterado`)
                        .setImage(text)
                    ],
                    ephemeral:true
                }).then(async() => {
                    await db.set(`${id}.banner`, text);
                    configmsg()
                }).catch(() => {
                    interaction.reply({content:`${emoji(29)} | Banner inválido!`, ephemeral:true})
                })
            } catch{ 
                interaction.reply({content:`${emoji(29)} | Banner inválido!`, ephemeral:true})
            }

        }

        if(custom === "roleprodtrocar") {
            resettime();
            interaction.update({
                embeds:[
                    new EmbedBuilder()
                    .setTitle(`${interaction.client.user.username} | Configurar Cargo`)
                    .setDescription(`Selecione um cargo aqui para ser setado quando alguém comprar este produto.`)
                    .setColor(colorembed)
                ],
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new RoleSelectMenuBuilder()
                        .setCustomId(`${userid}_${id}_roleselectprod`)
                        .setPlaceholder("Selecione o cargo de cliente:")
                    ),
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_${id}_removerroleprod`)
                        .setLabel("Remover Cargo")
                        .setStyle(4),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_${id}_configadvprod`)
                        .setLabel("Voltar")
                        .setStyle(2)
                        .setEmoji("⬅")
                    )
                ]
            })
        }
        if(custom === "roleselectprod") { 
            resettime();
            const role = interaction.values[0];
                try{
                    await interaction.member.roles.add(role).then(async() => {
                        await db.set(`${id}.role`, role);
                        await config();
                    }).catch(async (err) => {
                        if(err.message === "Missing Permissions") {
                            await config();
                            interaction.followUp({content:`${emoji(2)} | Não é possível setar esse cargo! \nError: O cargo selecionado é superior ao meu!`, ephemeral:true});
                        }
                    })
                } catch {
                    await config();
                    interaction.followUp({content:`${emoji(2)} | Não é possível setar esse cargo! \nError: O cargo selecionado é superior ao meu!`, ephemeral:true});
                }
        }
        if(custom === "removerroleprod") {
            resettime();
            await db.set(`${id}.role`, "Não Configurado");
            await config();
        }

        if(customId.endsWith("_corembedprodtrocar")) {
            resettime();
            const modal = new ModalBuilder()
            .setCustomId(`${userid}_${id}_alterarcolorprod`)
            .setTitle("🔧 | Alterar Cor Padrão");

            const text = new TextInputBuilder()
            .setCustomId("text")
            .setLabel("NOVA COR PADRÃO: ")
            .setStyle(1)
            .setMaxLength(30)
            .setRequired(true)
            .setPlaceholder("Ex: #f4d03f");

            modal.addComponents(new ActionRowBuilder().addComponents(text));

            return interaction.showModal(modal);
        }
        if(customId.endsWith("_alterarcolorprod")) {
            resettime();
            const text = interaction.fields.getTextInputValue("text");
            await interaction.reply({content:`${emoji(44)} | Aguarde um Momento...`, ephemeral:true});

            try { 
                interaction.editReply({
                    content:`${interaction.user}`,
                    embeds:[
                        new EmbedBuilder()
                        .setColor(text)
                        .setDescription(`${emoji(11)} | Cor do bot editado com **sucesso.** Nova cor \`${text}\``)
                    ]
                }).then(async () => {
                    await db.set(`${id}.cor`, text);
                }).catch(() => {
                    
                interaction.editReply({
                    content:`${emoji(2)} | Cor inválida, para pegar uma cor hex [Clique Aqui](https://g.co/kgs/KbZVXP)`
                });
                })
            } catch {
                interaction.editReply({
                    content:`${emoji(2)} | Cor inválida, para pegar uma cor hex [Clique Aqui](https://g.co/kgs/KbZVXP)`
                });
            }

            configmsg();

        }
        if(custom === "categoryprodtrocar") {
            resettime();
            interaction.update({
                embeds:[
                    new EmbedBuilder()
                    .setTitle(`${interaction.client.user.username} | Configurar Categoria`)
                    .setDescription(`Selecione a Categoria que o carrinho será aberto.`)
                    .setColor(colorembed)
                ],
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new ChannelSelectMenuBuilder()
                        .setCustomId(`${userid}_${id}_categoryprod`)
                        .setChannelTypes(ChannelType.GuildCategory)
                        .setPlaceholder("Selecione a Categoria Carrinho:")
                    ),
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_${id}_removercategoryprod`)
                        .setLabel("Remover Categoria")
                        .setStyle(4),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_${id}_configadvprod`)
                        .setLabel("Voltar")
                        .setStyle(2)
                        .setEmoji("⬅")
                    )
                ]
            })
        }

        if(custom === "categoryprod") {
            resettime();
            await db.set(`${id}.category`, interaction.values[0]);
            await config();
        }
        if(custom === "removercategoryprod") {
            resettime();
            await db.set(`${id}.category`, "Não Configurado");
            await config();
        }

        if(custom === "onoffcupomprod") {
            if(prod.cupom === true) {
                await db.set(`${id}.cupom`, false);
            } else {
                await db.set(`${id}.cupom`, true);
            }
            config();
        }

        async function configmsg() {
            const prod = await db.get(`${id}`);
            const category = interaction.guild.channels.cache.get(prod.category);
            const role = interaction.guild.roles.cache.get(prod.role);
            let banner = "Não Configurado.";
            let Miniatura = "Não Configurado.";
            if(await db.get(`${id}.banner`).startsWith("https://")) {
                banner = `[Banner](${await db.get(`${id}.banner`)})`
            }
            if(await db.get(`${id}.miniatura`).startsWith("https://")) {
                Miniatura = `[Miniatura](${await db.get(`${id}.miniatura`)})`
                
            }

            await interaction.message.edit({
                embeds:[
                    new EmbedBuilder() 
                    .setColor(colorembed)
                    .setTitle(`${interaction.client.user.username} | Outras Configurações`)
                    .setDescription(`🛒 | Categoria: ${category ?? "Não Configurado."}\n📂 | Banner: ${banner}\n🖼️ | Miniatura: ${Miniatura}\n👥 | Cargo: ${role ?? "Não Configurado"}\n🖌️ | Cor Embed: ${prod.cor}\n📦 | Cupom:${prod.cupom === true ? " Pode utilizar cupom nesse produto!" :"Não pode utilizar nenhum cupom nesse produto!"}`)
                    .setFooter({text:`${interaction.client.user.username} - Todos os direitos reservados.`, iconURL: interaction.client.user.displayAvatarURL()})
                ],
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_${id}_bannerprodtrocar`)
                        .setLabel("Banner")
                        .setEmoji("🖼")
                        .setStyle(1),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_${id}_miniaturaprodtrocar`)
                        .setLabel("Miniatura")
                        .setEmoji("🖼")
                        .setStyle(1),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_${id}_roleprodtrocar`)
                        .setLabel("Cargo")
                        .setEmoji("<:users_cloud:1213635311905669203>")
                        .setStyle(1),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_${id}_corembedprodtrocar`)
                        .setLabel("Cor Embed")
                        .setEmoji("🖌")
                        .setStyle(1),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_${id}_categoryprodtrocar`)
                        .setLabel("Definir Categoria")
                        .setEmoji("<:carrin_cloud:1221873043958268045>")
                        .setStyle(1),
                    ),
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_${id}_onoffcupomprod`)
                        .setLabel("Ativar/Desativar Cupons")
                        .setEmoji("<:Contrato_cloud:1221874795088445490>")
                        .setStyle(1)
                    ),
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_${id}_attmsgprod`)
                        .setLabel("Atualizar Mensagem")
                        .setEmoji("<a:carregando_cloud:1221875082708914362>")
                        .setStyle(1),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_${id}_voltarprod`)
                        .setLabel("Voltar")
                        .setEmoji("⬅")
                        .setStyle(1),
                    )
                ]
            })
        }
        
        async function chm(quanti) {
            const prod = await db.get(`${id}`);
            const channel = interaction.client.channels.cache.get(`${prod.mensagem.channel}`);

                prod.espera.forEach(a => {
                    const user = interaction.guild.members.cache.get(a);
                    if(user) {
                        user.send({
                            embeds:[
                                new EmbedBuilder()
                                .setTitle(`${interaction.client.user.username} - Notificações`)
                                .setDescription(`${emoji(33)} | O estoque do produto **${prod.nome}**, foi reabastecido \`${quanti}\` itens.\n${emoji(14)} | O produto se encontra no canal: ${channel ?? "`Não Encontrado...`"}`)
                                .setColor("Random")
                                .setThumbnail(interaction.client.user.displayAvatarURL())
                            ]
                        }).catch(() => {});
                    }
                });
                await db.set(`${id}.espera`, []);
        

        }
        async function config() {
            const prod = await db.get(`${id}`);
            const category = interaction.guild.channels.cache.get(prod.category);
            const role = interaction.guild.roles.cache.get(prod.role);
            let banner = "Não Configurado.";
            let Miniatura = "Não Configurado.";
            if(await db.get(`${id}.banner`).startsWith("https://")) {
                banner = `[Banner](${await db.get(`${id}.banner`)})`
            }
            if(await db.get(`${id}.miniatura`).startsWith("https://")) {
                Miniatura = `[Miniatura](${await db.get(`${id}.miniatura`)})`
            }

            await interaction.update({
                embeds:[
                    new EmbedBuilder() 
                    .setColor(colorembed)
                    .setTitle(`${interaction.client.user.username} | Outras Configurações`)
                    .setDescription(`🛒 | Categoria: ${category ?? "Não Configurado."}\n📂 | Banner: ${banner}\n🖼️ | Miniatura: ${Miniatura}\n👥 | Cargo: ${role ?? "Não Configurado"}\n🖌️ | Cor Embed: ${prod.cor}\n📦 | Cupom:${prod.cupom === true ? " Pode utilizar cupom nesse produto!" :"Não pode utilizar nenhum cupom nesse produto!"}`)
                    .setFooter({text:`${interaction.client.user.username} - Todos os direitos reservados.`, iconURL: interaction.client.user.displayAvatarURL()})
                ],
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_${id}_bannerprodtrocar`)
                        .setLabel("Banner")
                        .setEmoji("🖼")
                        .setStyle(1),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_${id}_miniaturaprodtrocar`)
                        .setLabel("Miniatura")
                        .setEmoji("🖼")
                        .setStyle(1),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_${id}_roleprodtrocar`)
                        .setLabel("Cargo")
                        .setEmoji("<:users_cloud:1213635311905669203>")
                        .setStyle(1),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_${id}_corembedprodtrocar`)
                        .setLabel("Cor Embed")
                        .setEmoji("🖌")
                        .setStyle(1),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_${id}_categoryprodtrocar`)
                        .setLabel("Definir Categoria")
                        .setEmoji("<:carrin_cloud:1221873043958268045>")
                        .setStyle(1),
                    ),
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_${id}_onoffcupomprod`)
                        .setLabel("Ativar/Desativar Cupons")
                        .setEmoji("<:Contrato_cloud:1221874795088445490>")
                        .setStyle(1)
                    ),
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_${id}_attmsgprod`)
                        .setLabel("Atualizar Mensagem")
                        .setEmoji("<a:carregando_cloud:1221875082708914362>")
                        .setStyle(1),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_${id}_voltarprod`)
                        .setLabel("Voltar")
                        .setEmoji("⬅")
                        .setStyle(1),
                    )
                ]
            })
        }
        async function stockedit() {
            const stock = await db.get(`${id}.conta`);
            let conts = "";
            let as = 0;
            if(stock.length <= 0) {
                conts = "Sem estoque, adicione"
            } else {
                
            stock.map((rs, index) => {
                as++;
                if(as < 30) {
                    conts += `📦** | ${index}** - ${rs} \n`;
                }
            });
            }
            if(conts.length > 2500) {
                conts = conts.slice(0, 2500);
                conts += "....\n\n**Estoque Muito Grande, Para ver, faça Backup.**";
            }
            await interaction.message.edit({
                embeds:[
                    new EmbedBuilder()
                    .setTitle(`${interaction.client.user.username} | Gerenciar Produto`)
                    .setDescription(`Este é seu estoque:\n ${conts}`)
                    .setFooter({text:`${as > 30 ? "Existem + produtos no estoque, faça um backup para ver seu estoque completo!" : "Este é seu estoque completo"}`, iconURL: interaction.client.user.displayAvatarURL()})
                    .setColor(colorembed)
                ],
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_${id}_addstockprod`)
                        .setStyle(3)
                        .setEmoji("<:mais_cloud:1213643443897634956>")
                        .setLabel("ADICIONAR"),

                        new ButtonBuilder()
                        .setCustomId(`${userid}_${id}_removestockprod`)
                        .setStyle(2)
                        .setEmoji("<:menos_cloud:1213652114891604039>")
                        .setLabel("REMOVER"),

                        new ButtonBuilder()
                        .setCustomId(`${userid}_${id}_backupstockprod`)
                        .setStyle(1)
                        .setEmoji("💾")
                        .setLabel("BACKUP"),

                        new ButtonBuilder()
                        .setCustomId(`${userid}_${id}_cleanstockprod`)
                        .setStyle(4)
                        .setEmoji("<:lixo_cloud:1221875710956797992>")
                        .setLabel("LIMPAR"),
                    ),
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_${id}_attmsgprod`)
                        .setLabel("Atualizar Mensagem")
                        .setEmoji("<a:carregando_cloud:1221875082708914362>")
                        .setStyle(1),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_${id}_voltarprod`)
                        .setLabel("Voltar")
                        .setEmoji("⬅")
                        .setStyle(1),
                    )
                ]
            })

        }
        async function stock() {
            
            const stock = await db.get(`${id}.conta`);
            let conts = "";
            let as = 0;
            if(stock.length <= 0) {
                conts = "Sem estoque, adicione"
            } else {
                
            stock.map((rs, index) => {
                as++;
                if(as < 30) {
                    conts += `📦** | ${index}** - ${rs} \n`;
                }
            });
            }

            
            if(conts.length > 2500) {
                conts = conts.slice(0, 2500);
                conts += "....\n\n**Estoque Muito Grande, Para ver, faça Backup.**";
            }
            await interaction.update({
                embeds:[
                    new EmbedBuilder()
                    .setTitle(`${interaction.client.user.username} | Gerenciar Produto`)
                    .setDescription(`Este é seu estoque:\n ${conts}`)
                    .setFooter({text:`${as > 30 ? "Existem + produtos no estoque, faça um backup para ver seu estoque completo!" : "Este é seu estoque completo"}`, iconURL: interaction.client.user.displayAvatarURL()})
                    .setColor(colorembed)
                ],
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_${id}_addstockprod`)
                        .setStyle(3)
                        .setEmoji("<:mais_cloud:1213643443897634956>")
                        .setLabel("ADICIONAR"),

                        new ButtonBuilder()
                        .setCustomId(`${userid}_${id}_removestockprod`)
                        .setStyle(2)
                        .setEmoji("<:menos_cloud:1213652114891604039>")
                        .setLabel("REMOVER"),

                        new ButtonBuilder()
                        .setCustomId(`${userid}_${id}_backupstockprod`)
                        .setStyle(1)
                        .setEmoji("💾")
                        .setLabel("BACKUP"),

                        new ButtonBuilder()
                        .setCustomId(`${userid}_${id}_cleanstockprod`)
                        .setStyle(4)
                        .setEmoji("<:lixo_cloud:1221875710956797992>")
                        .setLabel("LIMPAR"),
                    ),
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_${id}_attmsgprod`)
                        .setLabel("Atualizar Mensagem")
                        .setEmoji("<a:carregando_cloud:1221875082708914362>")
                        .setStyle(1),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_${id}_voltarprod`)
                        .setLabel("Voltar")
                        .setEmoji("⬅")
                        .setStyle(1),
                    )
                ]
            })

        }
        async function embed() {
            const prod = await db.get(`${id}`);
            await interaction.update({
                content:``,
                embeds:[
                    new EmbedBuilder() 
                    .setTitle(`${interaction.client.user.username} | Gerenciar Produto`)
                    .setDescription(`**📝 | Descrição:**\n${prod.desc}\n\n🔍 | Id: ${id}\n🪐 | Nome: ${prod.nome}\n💸 | Preço: R$${prod.preco}\n📦 | Estoque quantidade: ${prod.conta.length}`)
                    .setColor(colorembed)
                    .setFooter({text:`${interaction.client.user.username} - Todos os direitos reservados.`, iconURL: interaction.client.user.displayAvatarURL()})
                ],
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${interaction.user.id}_${id}_mudarnomeprod`)
                        .setLabel("NOME")
                        .setEmoji("<a:planeta_cloud:1221858904015765524>")
                        .setStyle(3),
                        new ButtonBuilder()
                        .setCustomId(`${interaction.user.id}_${id}_mudarprecoprod`)
                        .setLabel("PREÇO")
                        .setEmoji("<:Dinheiro_cloud:1221872674188562443>")
                        .setStyle(3),
                        new ButtonBuilder()
                        .setCustomId(`${interaction.user.id}_${id}_mudardescprod`)
                        .setLabel("DESCRIÇÃO")
                        .setEmoji("<:folha_cloud:1221870992817782936>")
                        .setStyle(3),
                        new ButtonBuilder()
                        .setCustomId(`${interaction.user.id}_${id}_mudarestoqueprod`)
                        .setLabel("ESTOQUE")
                        .setEmoji("<:Caixa_cloud:1221879519309463643>")
                        .setStyle(3),
                    ),
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${interaction.user.id}_${id}_configadvprod`)
                        .setLabel("Configurações Avançadas")
                        .setEmoji("<:engrenagem_cloud:1213652588571004959>")
                        .setStyle(1),
                        new ButtonBuilder()
                        .setCustomId(`${interaction.user.id}_${id}_attmsgprod`)
                        .setLabel("Atualizar Mensagem")
                        .setEmoji("<a:carregando_cloud:1221875082708914362>")
                        .setStyle(1),
                        new ButtonBuilder()
                        .setCustomId(`${interaction.user.id}_${id}_deleteprod`)
                        .setLabel("DELETAR")
                        .setEmoji("<:lixo_cloud:1221875710956797992>")
                        .setStyle(4),
                        )
                ]
            })

        }
        async function downloadFile(url) {
            try {
                const response = await axios.get(url, { responseType: 'arraybuffer' });
                return Buffer.from(response.data, 'binary').toString('utf-8');
            } catch (error) {
                console.error('Erro ao baixar o arquivo:', error.message);
                throw error;
            }
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