const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, ActivityType, StringSelectMenuBuilder, ChannelSelectMenuBuilder, ChannelType, RoleSelectMenuBuilder, AttachmentBuilder } = require("discord.js");
const {bot,db,logs,pn,rd,vnd, token, personalizar, cupom, saldo, perm} = require("../../database/index"); 
let timer = {};
const axios = require("axios");
const fs = require("fs");
const mercadopago = require("mercadopago")
const moment = require("moment")
const { QuickDB } = require("quick.db");
const carrinho = new QuickDB({table:"carrinho"});
const entrega = new QuickDB({table:"produtoentregue"});



module.exports = {
    name:"interactionCreate", 
    run: async( interaction, client) => {
        const colorembed = await bot.get("cor");
        const custom = interaction.customId;
        if(!custom) return;
        const id = custom.split("_")[0];
        const userid = custom.split("_")[1];
        const chnid = interaction.channel.id;
        if(custom.endsWith("_notifyproduct")) {
            const a = await db.get(`${id}`);
            if(a.espera.includes(interaction.user.id)) {
                await db.pull(`${id}.espera`, (element) => element === interaction.user.id, true);
                interaction.reply({content:`${emoji(11)} | Você já estava com as notificações ativadas, portanto elas foram desativadas.\n**Caso queira ativar só clicar no botão novamente!**`, ephemeral:true});
            } else {
                await db.push(`${id}.espera`, interaction.user.id);
                interaction.reply({content:`${emoji(11)} | Notificações ativadas com sucesso!`, ephemeral:true});
            }
        }
        if(custom.endsWith("_produto")) { 
            const prod = await db.get(`${id}`);
            if(!await vnd.get("semiauto")) {
                const acess = await vnd.get("acess_token");
                if(acess === "Não Configurado") {
                    return interaction.reply({
                        embeds:[
                            new EmbedBuilder().setColor(colorembed)
                            .setTitle(`${interaction.client.user.username} | Espere um momento...`)
                            .setDescription(`${emoji(29)} | Aguarde até que configurem as formas de pagamento...`)
                            
                            .setThumbnail(),
                        ],
                        ephemeral:true
                    });
                }
            }
            if(!prod) {
                await interaction.reply({content:`${emoji(29)} | Houve um Engano, este Produto não era pra está aqui!`, ephemeral:true});
                interaction.message.delete();
                return;
            }
            edit();
            
            if(prod.conta.length <= 0) return interaction.reply({
                embeds:[
                    new EmbedBuilder().setColor(colorembed)
                    .setDescription(`${emoji(29)} | Este produto está sem estoque, aguarde um reabastecimento!`)
                    .setColor("Red"),
                ],
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${id}_notifyproduct`)
                        .setLabel("Ativar Notificações")
                        .setEmoji("<a:No_cloud:1221871824216920135>")
                        .setStyle(2),
                    )
                ],
                ephemeral:true
            });

            const category = interaction.guild.channels.cache.get(await db.get(`${id}.category`)); 
            if(!category) {
                const category = interaction.guild.channels.cache.get(await vnd.get(`category`));
                if(!category) return await interaction.reply({
                    embeds:[
                        new EmbedBuilder().setColor(colorembed)
                        .setTitle(`${interaction.client.user.username} | Sistema de Vendas`)
                        .setDescription(`${emoji(29)} | ${interaction.user}, o dono do bot ainda não configurou as categorias, aguarde até ele configurar!`)
                        .setColor("Red")
                    ],
                    ephemeral:true
                });
            }

            const channel = interaction.guild.channels.cache.find(c => c.topic === `carrinho - ${interaction.user.id}`);
            if(channel) {
                const datab = await carrinho.get(`${channel.id}_carrinhoproduto_${id}`);
                if(datab) return interaction.reply({content:`${emoji(29)} | Esse produto já está no seu carrinho!`, ephemeral:true,components:[new ActionRowBuilder().addComponents(new ButtonBuilder().setStyle(5).setLabel("・Ir para o Carrinho").setURL(channel.url).setEmoji("🛒"))]});
                if((await carrinho.all()).filter(a => a.id.startsWith(`${channel.id}_carrinhoproduto_`)).length > 5) {
                    return interaction.reply({content:`${emoji(29)} | Você só pode adicionar até 5 no carrinho!`, ephemeral:true});
                }
                
                if(await carrinho.get(`${channel.id}.status`) !== "Escolha de Produto") {
                    return interaction.reply({content:`${emoji(29)} | Não é possível adicionar mais produtos no seu carrinho!`, ephemeral:true});
                }
                await channel.send({
                    embeds:[
                        new EmbedBuilder().setColor(colorembed)
                        
                        .setDescription(`${personalizar.get("0")} | **Produto:** \`${prod.nome}\`\n\n${personalizar.get("4")} | **Quantidade:** \`1\`\n\n${personalizar.get("3")} | **Preço:** \`R$${prod.preco}\`\n\n${personalizar.get("14")} | **Quantidade disponivel:** \`${prod.conta.length}\``)
                    ],
                    components:[
                        new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                            .setCustomId(`${id}_${interaction.user.id}_adicionarprod`)
                            .setLabel("+")
                            .setStyle(2),
                            new ButtonBuilder()
                            .setCustomId(`${id}_${interaction.user.id}_modifyquantia`)
                            .setEmoji("✏")
                            .setStyle(3),
                            new ButtonBuilder()
                            .setCustomId(`${id}_${interaction.user.id}_removerprod`)
                            .setLabel("-")
                            .setStyle(2),
                            new ButtonBuilder()
                            .setCustomId(`${id}_${interaction.user.id}_tirarprod`)
                            .setEmoji("<:lixo_cloud:1221875710956797992>")
                            .setStyle(4),
                        )
                    ]
                });
                
                await carrinho.set(`${channel.id}_carrinhoproduto_${id}`, {
                    quantidade: 1,
                    preco: prod.preco,
                    id: id
                });
                return interaction.reply({ 
                    embeds:[
                        new EmbedBuilder().setColor(colorembed)
                        .setTitle(`${interaction.client.user.username} | Sistema de Vendas`)
                        .setDescription(`${await personalizar.get("1")}** | ${interaction.user} Produto adicionado com sucesso no seu carrinho!**`)
                        
                    ],
                    ephemeral:true,
                    components:[new ActionRowBuilder().addComponents(new ButtonBuilder().setStyle(5).setLabel("・Ir para o Carrinho").setURL(channel.url).setEmoji("🛒"))]
                });
            }

            await interaction.reply({content:`${emoji(44)} | Criando o Carrinho...`, ephemeral:true}); 

            let channelurl = "";
            try {
                await interaction.guild.channels.create({
                    name:`🛒・${interaction.user.username}`,
                    topic:`carrinho - ${interaction.user.id}`,
                    type:ChannelType.GuildText,
                    permissionOverwrites:[
                      {
                        id: interaction.guild.id,
                        deny: ["SendMessages", "ViewChannel"]
                      },
                      {
                        id: interaction.user.id,
                        allow: ["ViewChannel"],
                        deny:"SendMessages"
                      },
                    ],
                    parent: await db.get(`${id}.category`) === "Não Definida." ? await vnd.get(`category`) : await db.get(`${id}.category`)
                }).then(async(chn) => {
                    if(chn) {
                        channelurl = chn.url
                        resettime(chn);
                    await chn.send({
                        content:`${interaction.user}`,
                        embeds:[
                            new EmbedBuilder().setColor(colorembed)
                            
                            .setTitle(`${interaction.client.user.username} | Sistema de compra`)
                            .setDescription(`${personalizar.get("34")} | Olá ${interaction.user}, este é seu carrinho, fique á vontade para adicionar mais produtos ou fazer as modificações que achar necessário.\n\n${personalizar.get("35")} | Lembre-se de ler nossos termos de compra, para não ter nenhum problema futuramente, ao continuar com a compra, você concorda com nossos termos.\n\n${personalizar.get("33")} | Quando estiver tudo pronto aperte o botão abaixo, para continuar sua compra!`)
                            .setFooter({text:`${interaction.client.user.username} - Todos os direitos reservados.`, iconURL: `${interaction.client.user.displayAvatarURL()}`})
                        ],
                        components:[
                            new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                .setCustomId(`${interaction.user.id}_aceitarcomprar`)
                                .setLabel("Aceitar e Continuar")
                                .setEmoji("<a:sim_cloud:1221871466899832995>")
                                .setStyle(3),
                                new ButtonBuilder()
                                .setCustomId(`${interaction.user.id}_cancelarcarrinho`)
                                .setLabel("Cancelar")
                                .setEmoji("<a:No_cloud:1221871824216920135>")
                                .setStyle(4),
                                new ButtonBuilder()
                                .setCustomId(`terms`) 
                                .setLabel("Ler os Termos")
                                .setEmoji("📋")
                                .setStyle(3),
                            )
                        ]
                    }).then(async() => {
                        const prod = await db.get(`${id}`);
                       await chn.send({
                            embeds:[
                                new EmbedBuilder().setColor(colorembed)
                                .setDescription(`${personalizar.get("0")} | **Produto:** \`${prod.nome}\`\n\n${personalizar.get("4")} | **Quantidade:** \`1\`\n\n${personalizar.get("3")} | **Preço:** \`R$${prod.preco}\`\n\n${personalizar.get("14")} | **Quantidade disponivel:** \`${prod.conta.length}\``)
                            ],
                            components:[
                                new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                    .setCustomId(`${id}_${interaction.user.id}_adicionarprod`)
                                    .setLabel("+")
                                    .setStyle(2),
                                    new ButtonBuilder()
                                    .setCustomId(`${id}_${interaction.user.id}_modifyquantia`)
                                    .setLabel("✏️")
                                    .setStyle(3),
                                    new ButtonBuilder()
                                    .setCustomId(`${id}_${interaction.user.id}_removerprod`)
                                    .setLabel("-")
                                    .setStyle(2),
                                    new ButtonBuilder()
                                    .setCustomId(`${id}_${interaction.user.id}_tirarprod`)
                                    .setEmoji("<:lixo_cloud:1221875710956797992>")
                                    .setStyle(4),
                                )
                            ]
                        });
                        await carrinho.set(`${chn.id}_carrinhoproduto_${id}`, {
                            quantidade: 1,
                            preco: prod.preco,
                            id: id
                        });
                        await carrinho.set(`${chn.id}`, {
                            userid: interaction.user.id,
                            cupom: "Sem Cupom",
                            status:"Escolha de Produto",
                            totalpagar:0.01
                        })
                    })
                    } 

                    await interaction.editReply({
                        content:"",
                        embeds:[
                            new EmbedBuilder().setColor(colorembed)
                            .setTitle(`${interaction.client.user.username} | Sistema de Vendas`)
                            .setDescription(`${emoji(11)} | ${interaction.user} **Seu carrinho foi aberto com sucesso em: ${chn}, fique à vontade para adicionar mais produtos.**`)
                            .setColor("Green")
                        ],
                        components:[
                            new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                .setStyle(5)
                                .setLabel("・Ir para o Carrinho")
                                .setURL(channelurl)
                                .setEmoji("🛒")
                            )
                        ]
                    });

                })

                
            } catch (err){

                await interaction.editReply({content:`Ocorreu um erro: \n ${err.message}`})
                console.log(err)
                return;
            } finally {
                
                const aba = await vnd.get("notifycart"); 
                if(aba) {
                    const channel_logs = interaction.guild.channels.cache.get(await vnd.get("logs_adm")); 
                    if(channel_logs) {
                        try {
                            channel_logs.send({
                                embeds:[
                                    new EmbedBuilder().setColor(colorembed)
                                    .setColor("Green")
                                    .setTimestamp()
                                    .setThumbnail(interaction.client.user.displayAvatarURL())
                                    .setFooter({text:`${interaction.user.username} - ${interaction.user.id}`, iconURL: interaction.member.displayAvatarURL()})
                                    .setTitle(`${interaction.client.user.username} | Carrinho Criado`)
                                    .addFields(
                                        {
                                            name:`${await personalizar.get("17")} | Usuário:`,
                                            value:`\`${interaction.user.username} - ${interaction.user.id}\``,
                                        },
                                        {
                                            name:`${await personalizar.get("32")} | Criou um Carrinho:`,
                                            value:`\`Produto: ${prod.nome}\``,
                                        },
                                        {
                                            name:`${await personalizar.get("19")} | Data / Horário:`,
                                            value:`<t:${Math.floor(new Date() / 1000)}:f> (<t:${Math.floor(new Date() / 1000)}:R>)`,
                                        },
                                    )
                                ]
                            }) 
                        } catch{
                            console.log("Aconteceu um erro...")
                            console.error()
                        }
                    }
                }
                
            }
        }
        if(custom.endsWith("_painel")) {
            const id = interaction.values[0]; 
            const prod = await db.get(`${id}`);
            if(!await vnd.get("semiauto")) {
                const acess = await vnd.get("acess_token");
                if(acess === "Não Configurado") {
                    return interaction.reply({
                        embeds:[
                            new EmbedBuilder().setColor(colorembed)
                            .setTitle(`${interaction.client.user.username} | Espere um momento...`)
                            .setDescription(`${emoji(29)} | Aguarde até que configurem as formas de pagamento...`)
                            
                            .setThumbnail(),
                        ],
                        ephemeral:true
                    });
                }
            }
            if(!prod) {
                await interaction.reply({content:`${emoji(29)} | Houve um Engano, este Produto não era pra está aqui!`, ephemeral:true});
                interaction.message.delete();
                return;
            }
            editpainel(custom.split("_")[0]);
            
            if(prod.conta.length <= 0) return interaction.reply({
                embeds:[
                    new EmbedBuilder().setColor(colorembed)
                    .setDescription(`${emoji(29)} | Este produto está sem estoque, aguarde um reabastecimento!`)
                    .setColor("Red"),
                ],
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${id}_notifyproduct`)
                        .setLabel("Ativar Notificações")
                        .setEmoji("<a:No_cloud:1221871824216920135>")
                        .setStyle(2),
                    )
                ],
                ephemeral:true
            });

            const category = interaction.guild.channels.cache.get(await db.get(`${id}.category`)); 
            if(!category) {
                const category = interaction.guild.channels.cache.get(await vnd.get(`category`));
                if(!category) return await interaction.reply({
                    embeds:[
                        new EmbedBuilder().setColor(colorembed)
                        .setTitle(`${interaction.client.user.username} | Sistema de Vendas`)
                        .setDescription(`${emoji(29)} | ${interaction.user}, o dono do bot ainda não configurou as categorias, aguarde até ele configurar!`)
                        .setColor("Red")
                    ],
                    ephemeral:true
                });
            }

            const channel = interaction.guild.channels.cache.find(c => c.topic === `carrinho - ${interaction.user.id}`);
            if(channel) {
                const datab = await carrinho.get(`${channel.id}_carrinhoproduto_${id}`);
                if(datab) return interaction.reply({content:`${emoji(29)} | Esse produto já está no seu carrinho!`, ephemeral:true,components:[new ActionRowBuilder().addComponents(new ButtonBuilder().setStyle(5).setLabel("・Ir para o Carrinho").setURL(channel.url).setEmoji("🛒"))]});
                if((await carrinho.all()).filter(a => a.id.startsWith(`${channel.id}_carrinhoproduto_`)).length > 5) {
                    return interaction.reply({content:`${emoji(29)} | Você só pode adicionar até 5 no carrinho!`, ephemeral:true});
                }
                
                if(await carrinho.get(`${channel.id}.status`) !== "Escolha de Produto") {
                    return interaction.reply({content:`${emoji(29)} | Não é possível adicionar mais produtos no seu carrinho!`, ephemeral:true});
                }
                await channel.send({
                    embeds:[
                        new EmbedBuilder().setColor(colorembed)
                        
                        .setDescription(`${personalizar.get("0")} | **Produto:** \`${prod.nome}\`\n\n${personalizar.get("4")} | **Quantidade:** \`1\`\n\n${personalizar.get("3")} | **Preço:** \`R$${prod.preco}\`\n\n${personalizar.get("14")} | **Quantidade disponivel:** \`${prod.conta.length}\``)
                    ],
                    components:[
                        new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                            .setCustomId(`${id}_${interaction.user.id}_adicionarprod`)
                            .setLabel("+")
                            .setStyle(2),
                            new ButtonBuilder()
                            .setCustomId(`${id}_${interaction.user.id}_modifyquantia`)
                            .setEmoji("✏")
                            .setStyle(3),
                            new ButtonBuilder()
                            .setCustomId(`${id}_${interaction.user.id}_removerprod`)
                            .setLabel("-")
                            .setStyle(2),
                            new ButtonBuilder()
                            .setCustomId(`${id}_${interaction.user.id}_tirarprod`)
                            .setEmoji("<:lixo_cloud:1221875710956797992>")
                            .setStyle(4),
                        )
                    ]
                });
                
                await carrinho.set(`${channel.id}_carrinhoproduto_${id}`, {
                    quantidade: 1,
                    preco: prod.preco,
                    id: id
                });
                return interaction.reply({ 
                    embeds:[
                        new EmbedBuilder().setColor(colorembed)
                        .setTitle(`${interaction.client.user.username} | Sistema de Vendas`)
                        .setDescription(`${await personalizar.get("1")}** | ${interaction.user} Produto adicionado com sucesso no seu carrinho!**`)
                        
                    ],
                    ephemeral:true,
                    components:[new ActionRowBuilder().addComponents(new ButtonBuilder().setStyle(5).setLabel("・Ir para o Carrinho").setURL(channel.url).setEmoji("🛒"))]
                });
            }

            await interaction.reply({content:`${emoji(44)} | Criando o Carrinho...`, ephemeral:true}); 

            let channelurl = "";
            try {
                await interaction.guild.channels.create({
                    name:`🛒・${interaction.user.username}`,
                    topic:`carrinho - ${interaction.user.id}`,
                    type:ChannelType.GuildText,
                    permissionOverwrites:[
                      {
                        id: interaction.guild.id,
                        deny: ["SendMessages", "ViewChannel"]
                      },
                      {
                        id: interaction.user.id,
                        allow: ["ViewChannel"],
                        deny:"SendMessages"
                      },
                    ],
                    parent: await db.get(`${id}.category`) === "Não Definida." ? await vnd.get(`category`) : await db.get(`${id}.category`)
                }).then(async(chn) => {
                    if(chn) {
                        channelurl = chn.url
                        resettime(chn);
                    await chn.send({
                        content:`${interaction.user}`,
                        embeds:[
                            new EmbedBuilder().setColor(colorembed)
                            
                            .setTitle(`${interaction.client.user.username} | Sistema de compra`)
                            .setDescription(`${personalizar.get("34")} | Olá ${interaction.user}, este é seu carrinho, fique á vontade para adicionar mais produtos ou fazer as modificações que achar necessário.\n\n${personalizar.get("35")} | Lembre-se de ler nossos termos de compra, para não ter nenhum problema futuramente, ao continuar com a compra, você concorda com nossos termos.\n\n${personalizar.get("33")} | Quando estiver tudo pronto aperte o botão abaixo, para continuar sua compra!`)
                            .setFooter({text:`${interaction.client.user.username} - Todos os direitos reservados.`, iconURL: `${interaction.client.user.displayAvatarURL()}`})
                        ],
                        components:[
                            new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                .setCustomId(`${interaction.user.id}_aceitarcomprar`)
                                .setLabel("Aceitar e Continuar")
                                .setEmoji("<a:sim_cloud:1221871466899832995>")
                                .setStyle(3),
                                new ButtonBuilder()
                                .setCustomId(`${interaction.user.id}_cancelarcarrinho`)
                                .setLabel("Cancelar")
                                .setEmoji("<a:No_cloud:1221871824216920135>")
                                .setStyle(4),
                                new ButtonBuilder()
                                .setCustomId(`terms`) 
                                .setLabel("Ler os Termos")
                                .setEmoji("📋")
                                .setStyle(3),
                            )
                        ]
                    }).then(async() => {
                        const prod = await db.get(`${id}`);
                       await chn.send({
                            embeds:[
                                new EmbedBuilder().setColor(colorembed)
                                .setDescription(`${personalizar.get("0")} | **Produto:** \`${prod.nome}\`\n\n${personalizar.get("4")} | **Quantidade:** \`1\`\n\n${personalizar.get("3")} | **Preço:** \`R$${prod.preco}\`\n\n${personalizar.get("14")} | **Quantidade disponivel:** \`${prod.conta.length}\``)
                            ],
                            components:[
                                new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                    .setCustomId(`${id}_${interaction.user.id}_adicionarprod`)
                                    .setLabel("+")
                                    .setStyle(2),
                                    new ButtonBuilder()
                                    .setCustomId(`${id}_${interaction.user.id}_modifyquantia`)
                                    .setLabel("✏️")
                                    .setStyle(3),
                                    new ButtonBuilder()
                                    .setCustomId(`${id}_${interaction.user.id}_removerprod`)
                                    .setLabel("-")
                                    .setStyle(2),
                                    new ButtonBuilder()
                                    .setCustomId(`${id}_${interaction.user.id}_tirarprod`)
                                    .setEmoji("<:lixo_cloud:1221875710956797992>")
                                    .setStyle(4),
                                )
                            ]
                        });
                        await carrinho.set(`${chn.id}_carrinhoproduto_${id}`, {
                            quantidade: 1,
                            preco: prod.preco,
                            id: id
                        });
                        await carrinho.set(`${chn.id}`, {
                            userid: interaction.user.id,
                            cupom: "Sem Cupom",
                            status:"Escolha de Produto",
                            totalpagar:0.01
                        })
                    })
                    } 

                    await interaction.editReply({
                        content:"",
                        embeds:[
                            new EmbedBuilder().setColor(colorembed)
                            .setTitle(`${interaction.client.user.username} | Sistema de Vendas`)
                            .setDescription(`${emoji(11)} | ${interaction.user} **Seu carrinho foi aberto com sucesso em: ${chn}, fique à vontade para adicionar mais produtos.**`)
                            .setColor("Green")
                        ],
                        components:[
                            new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                .setStyle(5)
                                .setLabel("・Ir para o Carrinho")
                                .setURL(channelurl)
                                .setEmoji("🛒")
                            )
                        ]
                    });

                })

                
            } catch (err){

                await interaction.editReply({content:`Ocorreu um erro: \n ${err.message}`})
                console.log(err)
                return;
            } finally {
                const aba = await vnd.get("notifycart");
                if(aba) {
                    const channel_logs = interaction.guild.channels.cache.get(await vnd.get("logs_adm"));
                    if(channel_logs) {
                        try {
                            channel_logs.send({
                                embeds:[
                                    new EmbedBuilder().setColor(colorembed)
                                    .setColor("Green")
                                    .setTimestamp()
                                    .setThumbnail(interaction.client.user.displayAvatarURL())
                                    .setFooter({text:`${interaction.user.username} - ${interaction.user.id}`, iconURL: interaction.member.displayAvatarURL()})
                                    .setTitle(`${interaction.client.user.username} | Carrinho Criado`)
                                    .addFields(
                                        {
                                            name:`${await personalizar.get("17")} | Usuário:`,
                                            value:`\`${interaction.user.username} - ${interaction.user.id}\``,
                                        },
                                        {
                                            name:`${await personalizar.get("32")} | Criou um Carrinho:`,
                                            value:`\`Produto: ${prod.nome}\``,
                                        },
                                        {
                                            name:`${await personalizar.get("19")} | Data / Horário:`,
                                            value:`<t:${Math.floor(new Date() / 1000)}:f> (<t:${Math.floor(new Date() / 1000)}:R>)`,
                                        },
                                    )
                                ]
                            }) 
                        } catch{
                            console.log("Aconteceu um erro...")
                            console.error()
                        }
                    }
                }
            }
        }
        if(custom.endsWith("_aceitarcomprar")) {
            const userid = custom.split("_")[0];
            if(interaction.user.id !== userid) return;
            await carrinho.set(`${interaction.user.id}.status`, "Resumo da Compra");
            let msg = "";
            const all = (await carrinho.all()).filter(a => a.id.startsWith(`${interaction.channel.id}_carrinhoproduto`));
            if(all.length <= 0) return interaction.reply({content:`${emoji(2)} | Não é possivel continuar sem produtos no carrinho!`, ephemeral:true});
            let totalpagar = 0;
            let f = false;
            all.map((a) => {
                const prod = db.get(`${a.value.id}`);
                if(prod.cupom === false) {
                    f = true;
                }
                msg += `${emoji(32)} | Produto: \`${prod.nome}\` \n${emoji(3)} | Valor unitário: \`R$${Number(prod.preco).toFixed(2)}\`\n${emoji(18)} | Quantidade: \`${a.value.quantidade}\`\n${emoji(14)} | Total: \`R$${prod.preco * a.value.quantidade}\` \n\n`;
                totalpagar += prod.preco * a.value.quantidade;
            });
            await carrinho.set(`${interaction.channel.id}.totalpagar`, Number(totalpagar).toFixed(2));
            interaction.channel.bulkDelete(6).then(async() => {
                interaction.channel.send({
                    content:`${interaction.user}`,
                    embeds:[
                        new EmbedBuilder().setColor(colorembed)
                        .setTitle(`${interaction.guild.name} | Resumo da Compra`)
                        .setDescription(`${msg}\n${emoji(14)}** | Produtos no Carrinho:** \`${all.length}\`\n${emoji(3)}** | Valor a Pagar:** \`R$${totalpagar.toFixed(2)}\`\n${emoji(31)} **| Cupom adicionado:** \`Sem Cupom\``)
                    ],
                    components:[
                        new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                            .setCustomId(`${interaction.user.id}_irpagamento`)
                            .setLabel("Ir para o Pagamento")
                            .setEmoji("<a:sim_cloud:1221871466899832995>")
                            .setStyle(3),
                            new ButtonBuilder()
                            .setCustomId(`${interaction.user.id}_addcupomdesconto`)
                            .setLabel("Adicionar Cupom de Desconto")
                            .setDisabled(f)
                            .setEmoji("📗")
                            .setStyle(1),
                            new ButtonBuilder()
                            .setCustomId(`${interaction.user.id}_cancelarcarrinho`)
                            .setLabel("Cancelar Compra")
                            .setEmoji("<a:No_cloud:1221871824216920135>")
                            .setStyle(4),
                        )
                    ]
                });
            })
        }
        if(custom.endsWith("_irpagamento")) {
            const userid = custom.split("_")[0];
            if(userid !== interaction.user.id) return;
            await interaction.channel.bulkDelete(5);
            const cart = await carrinho.get(`${interaction.channel.id}`);
            const all = (await carrinho.all()).filter(a => a.id.startsWith(`${interaction.channel.id}_carrinhoproduto`));
            let msg = "";
            all.map((a) => {
                const prod = db.get(`${a.value.id}`);
                if(prod.cupom === false) {
                    f = true;
                }
                msg += `${prod.nome} x${a.value.quantidade}\n`;
            });
            if(!await vnd.get("semiauto")) {
                await carrinho.set(`${interaction.channel.id}.status`, "Escolha de Pagamento");
                interaction.channel.send({
                    content:`${interaction.user}`,
                    embeds:[
                        new EmbedBuilder().setColor(colorembed)
                        .setTitle(`${interaction.guild.name} | Sistema de pagamento`)
                        .setDescription(`\`\`\`Escolha a forma de pagamento.\`\`\``)
                        .addFields(
                            {
                                name:`${emoji(32)} | Produtos(s):`,
                                value:`${msg}`
                            },
                            {
                                name:`${emoji(3)} | Valor:`,
                                value:`R$${cart.totalpagar}`
                            }
                        )
                        .setFooter({text:"Escolha a forma de pagamento utilizando os botões abaixo:", iconURL: interaction.client.user.displayAvatarURL()}) 
                    ],
                    components:[
                        new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                            .setCustomId(`${interaction.user.id}_pixautomaticamente`)
                            .setLabel("Pix")
                            .setEmoji("<:Pix:1221876826402586835>")
                            .setStyle(1),
                            new ButtonBuilder()
                            .setCustomId(`${interaction.user.id}_saldors1234`)
                            .setLabel("Saldo")
                            .setEmoji("💰")
                            .setStyle(1),
                            new ButtonBuilder()
                            .setCustomId(`${interaction.user.id}_pagarnositekkk`)
                            .setLabel("Pagar no Site")
                            .setEmoji("<:MercadoPago:1221877449340752002>")
                            .setStyle(1),
                            new ButtonBuilder()
                            .setCustomId(`${interaction.user.id}_cancelarcarrinho`)
                            .setEmoji("<a:No_cloud:1221871824216920135>")
                            .setStyle(4),
                        )
                    ]
                });
                
            } else {
                delete timer[interaction.channel];
                await interaction.channel.bulkDelete(10);
                await interaction.channel.permissionOverwrites.edit(interaction.user.id,{
                    ViewChannel: true,
                    SendMessages: true,
                    AttachFiles: true
                  });
                setTimeout(async() => {
                    const row = new ActionRowBuilder()
                 .addComponents(
                    new ButtonBuilder()
                     .setLabel('Chave Pix')
                     .setEmoji(`<:Pix:1221876826402586835>`) 
                     .setCustomId('chvpix')
                     .setStyle(1),
                     new ButtonBuilder()
                      .setLabel('Qr Code')
                      .setEmoji(`<:qrcode_cloud:1221878642267652139>`)
                      .setCustomId('qrcodepix')
                      .setDisabled(!await vnd.get("qrcode").startsWith("https://"))
                      .setStyle(1),
                      new ButtonBuilder()
                       .setLabel('Aprovar Compra')
                       .setEmoji(`<a:sim_cloud:1221871466899832995>`)
                       .setCustomId('aproveedcomprabuttonslakk')
                       .setStyle(3),
                     new ButtonBuilder()
                     .setCustomId(`${interaction.user.id}_cancelarcarrinho`)
                     .setEmoji("<a:No_cloud:1221871824216920135>")
                     .setLabel("Cancelar")
                     .setStyle(4),
                 );
                const shawkdu777 = await interaction.channel.send({
                    content:`${interaction.user}`,
                    embeds:[
                        new EmbedBuilder().setColor(colorembed)
                        .setTitle(`${interaction.guild.name} | Sistema de Pagamento`)
                        .setDescription(`\`\`\`Efetue o pagamento utilizando utilizando a Chave Pix ou Qr Code.\`\`\``)
                        .addFields(
                            {
                                name:`${emoji(32)} | Produto(s):`,
                                value:`${msg}`
                            },
                            {
                                name:`${emoji(3)} | Valor:`,
                                value:`R$${cart.totalpagar}`
                            },
                        )
                        .setFooter({text:`Após efetuar o pagamento, Envie o Comprovante e aguarde para que aprovem a compra.`, iconURL: interaction.client.user.displayAvatarURL()})
                    ],
                    components:[row]
                });
                }, 1000);
            }
        }
        if(interaction.isButton() && interaction.customId === "aproveedcomprabuttonslakk") {
            if(!await perm.get(`${interaction.user.id}`) && interaction.user.id !== token.get("owner")) return interaction.deferUpdate();
            const cart = await carrinho.get(`${interaction.channel.id}`);
            await interaction.channel.permissionOverwrites.edit(cart.userid,{
                ViewChannel: true,
                SendMessages: false,
                AttachFiles: false
              });
              await interaction.reply({content:`✅ | Compra Aprovada com sucesso!`, ephemeral:true});
              aprovved("a", "aprovado");
        }
        if(interaction.isButton() && interaction.customId === "qrcodepix") {
            interaction.reply({
                embeds:[
                    new EmbedBuilder()
                    .setTitle(`${interaction.guild.name} | QRCODE`)
                    .setImage(await vnd.get("qrcode"))
                ],
                ephemeral:true
            }).catch(() => {
                interaction.reply({content:`${emoji(2)} | Ocorreu um erro ao tentar renderizar o QRCode...`, ephemeral:true});
            })
        }
        if(interaction.isButton() && interaction.customId === "chvpix") {
            interaction.reply({
                embeds:[
                    new EmbedBuilder()
                    .addFields(
                        {
                            name:"🔑 | Chave Pix",
                            value:`${await vnd.get("tipochave")}`
                        },
                        {
                            name:"🔗 | Chave Pix",
                            value:`${await vnd.get("chavepix")}`
                        }
                    )
                ],
                ephemeral:true
            })
        }
        if(custom.endsWith("_pixautomaticamente")) {
            if (timer[interaction.channel]) {
                clearTimeout(timer[interaction.channel]);
            }
            const userid = custom.split("_")[0];
            if(userid !== interaction.user.id) return;
            const cart = await carrinho.get(`${interaction.channel.id}`);
            const cooldown = await vnd.get("tempmax");
            await carrinho.set(`${interaction.channel.id}.status`, "Processando...");
            const min = moment().add(Number(await vnd.get("tempmax")), 'minutes');
            const time = Math.floor(min.valueOf() / 1000);

            await interaction.channel.bulkDelete(5);
            const msg1 = await interaction.channel.send({content:`${emoji(44)} | Gerando Pagamento em pix...`});
            const all = (await carrinho.all()).filter(a => a.id.startsWith(`${interaction.channel.id}_carrinhoproduto`));
            
            let totalpagar = await carrinho.get(`${interaction.channel.id}.totalpagar`);
            let f = false;
            let msg = "";
            all.map((a) => {
                const prod = db.get(`${a.value.id}`);
                if(prod.cupom === false) {
                    f = true;
                }
                msg += `${prod.nome} x${a.value.quantidade}\n`;
            });

            const generateRandomString = (length) => {
                const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                return Array.from({ length }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
              };


            const acess = await vnd.get("acess_token");
            var date = new Date();
            const moment1 = require('moment-timezone');
            const min1 = moment1().tz("America/Argentina/Buenos_Aires").add(Number(cooldown), 'minutes').toISOString();
            mercadopago.configurations.setAccessToken(acess);
            var payment_data = {
                transaction_amount: Number(totalpagar),
                description:`Comprador: ${interaction.user.username}\n${msg}`,
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
                notification_url: interaction.guild.iconURL(),
                date_of_expiration: min1
            }

            mercadopago.payment.create(payment_data).then(async function (data) {
        
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
                     .setCustomId(`${interaction.user.id}_cancelarcarrinho`)
                     .setEmoji("<a:No_cloud:1221871824216920135>")
                     .setLabel("Cancelar")
                     .setStyle(4),
                 )
                await msg1.delete();
                const shawkdu777 = await interaction.channel.send({
                    content:`${interaction.user}`,
                    embeds:[
                        new EmbedBuilder().setColor(colorembed)
                        .setTitle(`${interaction.guild.name} | Sistema de Pagamento`)
                        .setDescription(`\`\`\`Efetue o pagamento no site do Mercado Pago para receber o produto.\`\`\``)
                        .addFields(
                            {
                                name:`${emoji(32)} | Produto(s):`,
                                value:`${msg}`
                            },
                            {
                                name:`${emoji(3)} | Valor:`,
                                value:`R$${totalpagar}`
                            },
                            {
                                name:`${emoji(12)} | Pagamento expira em:`,
                                value:`<t:${time}:f> (<t:${time}:R>)`
                            }
                        )
                        .setFooter({text:`Após efetuar o pagamento, clique no botão para eu verificar se o pagamento foi aprovado!`, iconURL: interaction.client.user.displayAvatarURL()})
                    ],
                    components:[row]
                });
                const a = setTimeout(async () => {
                    const user = interaction.user;
                    const aba = await vnd.get("notifycart");
                    if(aba) {
                        const c = interaction.client.channels.cache.get(await vnd.get("logs_adm"));
                        if(c) {
        
                            await c.send({
                                embeds:[
                                    new EmbedBuilder().setColor(colorembed)
                                    .setTitle(`${interaction.client.user.username} | Compra cancelada`)
                                    .setThumbnail(user.displayAvatarURL())
                                    .setFooter({text:`${user.id}`, iconURL: user.displayAvatarURL()})
                                    .setColor("Red")
                                    .addFields(
                                        {
                                            name:`${emoji(17)} | Usuário:`,
                                            value:`\`${user.username} - ${user.id}\``
                                        },
                                        {
                                            name:`${emoji(32)} | Motivo:`,
                                            value:`\`Cancelada por inatividade.\``
                                        },
                                        {
                                            name:`${emoji(19)} | Data/ Horário:`,
                                            value:`<t:${Math.floor(new Date() / 1000)}:f> (<t:${Math.floor(new Date() / 1000)}:R>)`
                                        }
                                    )
                                ]
                            });
                        }
                    }
                    user.send({
                        embeds:[
                            new EmbedBuilder().setColor(colorembed)
                            .setTitle(`${interaction.client.user.username} | Compra Cancelada`)
                            .setDescription(`Olá ${user}, \n\n• A sua compra foi cancelada por **inatividade**, e todos os produtos foram devolvidos para o estoque. Você pode voltar a comprar quando quiser!`)
                            .setColor("Red")
                        ],
                    }).catch(() => {});
                    if(interaction.channel) {
                        interaction.channel.delete()
                    } 
                }, Number(cooldown)  *60* 1000);
                const filter = i => i.user.id === interaction.user.id;
                const collector = interaction.channel.createMessageComponentCollector({filter});
                const aes = setInterval(async() => {
                    const resposta = await axios.get(`https://api.mercadopago.com/v1/payments/${data.body.id}`, {
                        headers: {
                            Authorization: `Bearer ${acess}`,
                        },
                    });
                    if (resposta.data.status === "approved") {
                        const longName = resposta.data.point_of_interaction.transaction_data.bank_info.payer.long_name;
                        if(await bot.get("banks").includes(longName)) {
                            refund(data.body.id, acess);
                            await interaction.channel.bulkDelete(5);
                            interaction.channel.send({
                                content:`> Olá ${interaction.user}, **obrigado por comprar conosco!** Infelizmente, detectamos que o banco que você usou para realizar o pagamento está na nossa lista de bancos proibidos, devido a problemas anteriores de fraude ou inadimplência. Por isso, **não podemos concluir a sua compra** e vamos estornar o valor pago para a sua conta. Pedimos desculpas pelo transtorno e sugerimos que você tente usar outro banco ou forma de pagamento. Caso tenha alguma dúvida ou reclamação, entre em contato com o nosso suporte. **Agradecemos a sua compreensão e esperamos atendê-lo novamente em breve.**`
                            });
                            if (timer[interaction.channel]) {
                                clearTimeout(timer[interaction.channel]);
                            }
                            return;
                        }  else {
                            await carrinho.set(`${interaction.channel.id}.status`, "aprovado");
                            await carrinho.set(`${interaction.channel.id}.pagamento`, "automatico");
                            await carrinho.set(`${interaction.channel.id}.idpag`, data.body.id);
                        }
                    }
                    if(interaction.channel) {
                        if(await carrinho.get(`${interaction.channel.id}.status`) === "aprovado") {
                            clearTimeout(a);
                            clearInterval(aes);
                            if (timer[interaction.channel]) clearTimeout(timer[interaction.channel]);        
                            return aprovved(await carrinho.get(`${interaction.channel.id}.idpag`), await carrinho.get(`${interaction.channel.id}.pagamento`));
                        }
                    }
                }, 2500);
                collector.on('collect', async (interaction2) => {
                    if (interaction2.customId == 'cpc') {
                      interaction2.reply({ content: `${data.body.point_of_interaction.transaction_data.qr_code}`, ephemeral: true });
                    }
                    
                    if (interaction2.customId == 'qrc') {
                      interaction2.reply({ files: [attachment], ephemeral: true });
                    }
                });

            });
        }
        if(custom.endsWith("_saldors1234")) {
            const userid = custom.split("_")[0];
            if(userid !== interaction.user.id) return;
            const cart = await carrinho.get(`${interaction.channel.id}`);
            const usersaldo = await saldo.get(`${interaction.user.id}.saldo`) || 0.00;
            if(usersaldo < cart.totalpagar) return interaction.reply({content:`${emoji(2)} Você tem apenas \`R$${usersaldo}\`, O Preço é dê ${Number(cart.totalpagar).toFixed(2)}`, ephemeral:true});
            await interaction.channel.bulkDelete(6);
            interaction.channel.send({
                content:`${interaction.user}`,
                embeds:[
                    new EmbedBuilder()
                    .setTitle(`${interaction.guild.name} | Sistema de Pagamento`)
                    .setDescription(`${emoji(30)} - Você deseja efetuar o pagamento?\n${emoji(3)} | Valor a Pagar: \`R$${Number(cart.totalpagar).toFixed(2)}\`\n${emoji(21)} | Seu Saldo: \`R$${Number(usersaldo).toFixed(2)}\``)
                    .setColor(colorembed)
                    .setThumbnail(interaction.client.user.displayAvatarURL())
                    .setFooter({text:`${interaction.guild.name}`, iconURL:interaction.guild.iconURL()})
                    .setTimestamp()
                ],
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${interaction.user.id}_comprarcomsaldo`)
                        .setStyle(1)
                        .setEmoji("<a:sim_cloud:1221871466899832995>")
                        .setLabel("Comprar"),
                        new ButtonBuilder()
                        .setCustomId(`${interaction.user.id}_irpagamento`)
                        .setLabel("Voltar")
                        .setStyle(2)
                        .setEmoji("⬅")
                    )
                ]
            })
        }
        if(custom.endsWith("_comprarcomsaldo")) {
            if (timer[interaction.channel]) {
                clearTimeout(timer[interaction.channel]);
            }
            const userid = custom.split("_")[0];
            if(userid !== interaction.user.id) return;
            const cart = await carrinho.get(`${interaction.channel.id}`);
            const usersaldo = await saldo.get(`${interaction.user.id}.saldo`);
            await interaction.update({components:[]});
            await interaction.channel.bulkDelete(10);
            const saltoagora = usersaldo - cart.totalpagar;
            await saldo.set(`${interaction.user.id}.saldo`, Number(saltoagora).toFixed(2));
            interaction.channel.send({content:`${emoji(11)} | Seu pagamento foi aprovado, Você tinha \`R$${Number(usersaldo).toFixed(2)}\`, Você pagou \`R$${Number(cart.totalpagar)}\` e agora você tem \`R$${saltoagora}\``})
            setTimeout(() => {
                aprovved(123, "saldo");
            }, 1500);
        }
        if(custom.endsWith("_pagarnositekkk")) {
            if (timer[interaction.channel]) {
                clearTimeout(timer[interaction.channel]);
            }
            const cooldown = await vnd.get("tempmax");
            await carrinho.set(`${interaction.channel.id}.status`, "Processando...");
            const min = moment().add(Number(await vnd.get("tempmax")), 'minutes');
            const time = Math.floor(min.valueOf() / 1000);

            await interaction.channel.bulkDelete(5);
            const msg1 = await interaction.channel.send({content:`${emoji(44)} | Criando Link de Pagamento...`});
            const all = (await carrinho.all()).filter(a => a.id.startsWith(`${interaction.channel.id}_carrinhoproduto`));
            
            let totalpagar = await carrinho.get(`${interaction.channel.id}.totalpagar`);
            let f = false;
            let msg = "";
            all.map((a) => {
                const prod = db.get(`${a.value.id}`);
                if(prod.cupom === false) {
                    f = true;
                }
                msg += `${prod.nome} x${a.value.quantidade}\n`;
            });

            const generateRandomString = (length) => {
                const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                return Array.from({ length }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
              };


            const acess = await vnd.get("acess_token");
            var date = new Date();
            const moment1 = require('moment-timezone');
            const min1 = moment1().tz("America/Argentina/Buenos_Aires").add(Number(cooldown), 'minutes').toISOString();
            mercadopago.configurations.setAccessToken(acess);
            const ID = `PAYMENTEE${generateRandomString(35)}`
            var preference = {
                items: [
                    {
                        title:`Comprador: ${interaction.user.username}\n${msg}`,
                        unit_price:Number(totalpagar),
                        quantity: 1
                    }
                ],
                external_reference: ID ,
                notification_url: interaction.guild.iconURL(),
                date_of_expiration: min1
            };


            mercadopago.preferences
            .create(preference)
            .then(async function(data) {
                await msg1.delete();
                const shawkdu777 = await interaction.channel.send({
                    content:`${interaction.user}`,
                    embeds:[
                        new EmbedBuilder().setColor(colorembed)
                        .setTitle(`${interaction.guild.name} | Sistema de Pagamento`)
                        .setDescription(`\`\`\`Efetue o pagamento no site do Mercado Pago para receber o produto.\`\`\``)
                        .addFields(
                            {
                                name:`${emoji(32)} | Produto(s):`,
                                value:`${msg}`
                            },
                            {
                                name:`${emoji(3)} | Valor:`,
                                value:`R$${totalpagar}`
                            },
                            {
                                name:`${emoji(12)} | Pagamento expira em:`,
                                value:`<t:${time}:f> (<t:${time}:R>)`
                            }
                        )
                        .setFooter({text:`Após efetuar o pagamento, clique no botão para eu verificar se o pagamento foi aprovado!`, iconURL: interaction.client.user.displayAvatarURL()})
                    ],
                    components:[
                        new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                            .setURL(data.body.init_point)
                            .setLabel("Realizar o Pagamento")
                            .setEmoji("<:MercadoPago:1221877449340752002>")
                            .setStyle(5),
                            new ButtonBuilder()
                            .setCustomId(`verifypayments`)
                            .setLabel("Verificar Pagamento")
                            .setEmoji("<a:sim_cloud:1221871466899832995>")
                            .setStyle(3),
                            new ButtonBuilder()
                            .setCustomId(`${interaction.user.id}_cancelarcarrinho`)
                            .setEmoji("<a:No_cloud:1221871824216920135>")
                            .setLabel("Cancelar")
                            .setStyle(4),
                        )
                    ]
                });
                const a = setTimeout(async () => {
                    const user = interaction.user;
                    const aba = await vnd.get("notifycart");
                    if(aba) {
                        
                    const c = interaction.client.channels.cache.get(await vnd.get("logs_adm"));
                    if(c) {
    
                        await c.send({
                            embeds:[
                                new EmbedBuilder().setColor(colorembed)
                                .setTitle(`${interaction.client.user.username} | Compra cancelada`)
                                .setThumbnail(user.displayAvatarURL())
                                .setFooter({text:`${user.id}`, iconURL: user.displayAvatarURL()})
                                .setColor("Red")
                                .addFields(
                                    {
                                        name:`${emoji(17)} | Usuário:`,
                                        value:`\`${user.username} - ${user.id}\``
                                    },
                                    {
                                        name:`${emoji(32)} | Motivo:`,
                                        value:`\`Cancelada por inatividade.\``
                                    },
                                    {
                                        name:`${emoji(19)} | Data/ Horário:`,
                                        value:`<t:${Math.floor(new Date() / 1000)}:f> (<t:${Math.floor(new Date() / 1000)}:R>)`
                                    }
                                )
                            ]
                        });
                    }
                    }
                    user.send({
                        embeds:[
                            new EmbedBuilder().setColor(colorembed)
                            .setTitle(`${interaction.client.user.username} | Compra Cancelada`)
                            .setDescription(`Olá ${user}, \n\n• A sua compra foi cancelada por **inatividade**, e todos os produtos foram devolvidos para o estoque. Você pode voltar a comprar quando quiser!`)
                            .setColor("Red")
                        ],
                    }).catch(() => {});
                    if(interaction.channel) {
                        interaction.channel.delete()
                    } 
                }, Number(cooldown)  *60* 1000);
                const chk = setInterval(() => {
                    if(carrinho.get(interaction?.channel?.id)?.status == "aprovado") {
                        aprovved();
                        clearTimeout(a);
                    } 
                }, 1000);
                const filter = i => i.user.id === interaction.user.id;
                const collector = interaction.channel.createMessageComponentCollector({filter});
                collector.on('collect', async (interaction) => {
                    if(interaction.customId === "verifypayments") {
                        await interaction.update({
                            components:[
                                new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                    .setURL(data.body.init_point)
                                    .setLabel("Realizar o Pagamento")
                                    .setEmoji("<:MercadoPago:1221877449340752002>")
                                    .setStyle(5),
                                    new ButtonBuilder()
                                    .setCustomId(`verifypayments`)
                                    .setDisabled(true)
                                    .setLabel("Verificar Pagamento")
                                    .setEmoji("<a:sim_cloud:1221871466899832995>")
                                    .setStyle(3),
                                    new ButtonBuilder()
                                    .setCustomId(`${interaction.user.id}_cancelarcarrinho`)
                                    .setEmoji("<a:No_cloud:1221871824216920135>")
                                    .setLabel("Cancelar")
                                    .setStyle(4),
                                )
                            ]
                        });
                        const url = `https://api.mercadopago.com/v1/payments/search?external_reference=${ID}`
                        const headers = {
                            'Content-Type': "application/json",
                            "Authorization": "Bearer " + acess
                        }
                        axios.get(url, {headers}) 
                        .then(async(response) => {
                            const Data = response.data?.results[0];
                            if(Data) {
                                const resposta = await axios.get(`https://api.mercadopago.com/v1/payments/${Data.id}`, {
                                    headers: {
                                        Authorization: `Bearer ${acess}`,
                                    },
                                });
                                const longName = resposta.data.point_of_interaction.transaction_data.bank_info.payer.long_name;
                                if(await bot.get("banks").includes(longName)) {
                                    refund(Data.id, acess);
                                    await interaction.channel.bulkDelete(5);
                                    interaction.channel.send({
                                        content:`> Olá ${interaction.user}, **obrigado por comprar conosco!** Infelizmente, detectamos que o banco que você usou para realizar o pagamento está na nossa lista de bancos proibidos, devido a problemas anteriores de fraude ou inadimplência. Por isso, **não podemos concluir a sua compra** e vamos estornar o valor pago para a sua conta. Pedimos desculpas pelo transtorno e sugerimos que você tente usar outro banco ou forma de pagamento. Caso tenha alguma dúvida ou reclamação, entre em contato com o nosso suporte. **Agradecemos a sua compreensão e esperamos atendê-lo novamente em breve.**`
                                    });
                                    if (timer[interaction.channel]) {
                                        clearTimeout(timer[interaction.channel]);
                                    }
                                    setTimeout(() => {
                                        if(interaction.channel) {
                                            if(interaction.channel) {
                                                interaction.channel.delete()
                                            }
                                        }
                                    }, 12000);
                                    
                                    return;
                                }  else {
                                    await carrinho.set(`${interaction.channel.id}.status`, "aprovado");
                                    await carrinho.set(`${interaction.channel.id}.pagamento`, "automatico");
                                    await carrinho.set(`${interaction.channel.id}.idpag`, Data.id);
                                }
                            }
                            
                            if(interaction.channel) {
                                if(await carrinho.get(`${interaction.channel.id}.status`) === "aprovado") {
                                    clearTimeout(a);
                                    clearInterval(chk);
                                    if (timer[interaction.channel]) clearTimeout(timer[interaction.channel]);
                                    
                                    return aprovved(await carrinho.get(`${interaction.channel.id}.idpag`), await carrinho.get(`${interaction.channel.id}.pagamento`));
                                }
                            }
                            if(!Data) {
                                interaction.followUp({content:`${emoji(2)} | O pagamento não foi encontrado!`, ephemeral:true});
                                setTimeout(() => {
                                    interaction.message.edit({
                                        components:[
                                            new ActionRowBuilder()
                                            .addComponents(
                                                new ButtonBuilder()
                                                .setURL(data.body.init_point)
                                                .setLabel("Realizar o Pagamento")
                                                .setEmoji("<:MercadoPago:1221877449340752002>")
                                                .setStyle(5),
                                                new ButtonBuilder()
                                                .setCustomId(`verifypayments`)
                                                .setLabel("Verificar Pagamento")
                                                .setEmoji("<a:sim_cloud:1221871466899832995>")
                                                .setStyle(3),
                                                new ButtonBuilder()
                                                .setCustomId(`${interaction.user.id}_cancelarcarrinho`)
                                                .setEmoji("<a:No_cloud:1221871824216920135>")
                                                .setLabel("Cancelar")
                                                .setStyle(4),
                                                )
                                        ]
                                    })
                                }, 3200);
                            } 
                        });

                    }
                });
            });
        }
        if(custom.endsWith("_addcupomdesconto")) {
            const userid = custom.split("_")[0];
            if(userid !== interaction.user.id) return;
            const modal = new ModalBuilder()
            .setCustomId(`${userid}_cupom123modal`)
            .setTitle("🏷 - Adicionar Cupom");

            const text = new TextInputBuilder()
            .setCustomId("text")
            .setStyle(1)
            .setLabel("Digite o seu cupom:")
            .setRequired(true)
            .setPlaceholder("Digite Aqui!");

            modal.addComponents(new ActionRowBuilder().addComponents(text));

            return interaction.showModal(modal);
        }
        if(custom.endsWith("_cupom123modal")) {
            const text = interaction.fields.getTextInputValue("text");
            const cm = await cupom.get(`${text}`);
            const all = (await carrinho.all()).filter(a => a.id.startsWith(`${interaction.channel.id}_carrinhoproduto`));
            let totalpagar = 0;
            let f = false;
            let msg = "";
            all.map((a) => {
                const prod = db.get(`${a.value.id}`);
                if(prod.cupom === false) {
                    f = true;
                }
                msg += `${emoji(32)} | Produto: \`${prod.nome}\` \n${emoji(3)} | Valor unitário: \`R$${Number(prod.preco).toFixed(2)}\`\n${emoji(18)} | Quantidade: \`${a.value.quantidade}\`\n${emoji(14)} | Total: \`R$${Number(prod.preco * a.value.quantidade).toFixed(2)}\` \n\n`;
                totalpagar += prod.preco * a.value.quantidade;
            });
            if(!cm) return interaction.reply({content:`${emoji(2)} | Cupom Invalido!`, ephemeral:true});
            if(cm.quantidade <= 0) return interaction.reply({content:`${emoji(29)} | Este cupom está esgotado!`, ephemeral:true});
            if(cm.valorminimo > totalpagar) return interaction.reply({content:`${emoji(29)} | Este cupom só pode ser Usado acima de \`R$${cm.valorminimo}\`!`, ephemeral:true});
            const role = interaction.guild.roles.cache.get(`${cm.cargo}`);
            if(role) if(!interaction.member.roles.cache.has(`${role.id}`)) return interaction.reply({content:`${emoji(2)} | Você não tem o cargo necessario para usar este cupom!`, ephemeral:true});
    
            const desconto = (Math.floor(cm.porcentagem * totalpagar) / 100).toFixed(2);
            await cupom.substr(`${text}.quantidade`, 1);
            await carrinho.set(`${interaction.channel.id}.cupom`, text);
            await carrinho.set(`${interaction.channel.id}.totalpagar`, Number(totalpagar.toFixed(2) - desconto).toFixed(2));
            await interaction.update({
                content:`${interaction.user}`,
                embeds:[
                    new EmbedBuilder().setColor(colorembed)
                    .setTitle(`${interaction.guild.name} | Resumo da Compra`)
                    .setDescription(`${msg}\n${emoji(14)}** | Produtos no Carrinho:** \`${all.length}\`\n${emoji(3)}** | Valor a Pagar:** \`R$${Number(totalpagar.toFixed(2) - desconto).toFixed(2)}\`\n${emoji(37)} **| Valor de desconto aplicado:** \`R$${desconto} - ${cm.porcentagem}%\`\n${emoji(31)} **| Cupom adicionado:** \`${text}\``)
                ],
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${interaction.user.id}_irpagamento`)
                        .setLabel("Ir para o Pagamento")
                        .setEmoji("<a:sim_cloud:1221871466899832995>")
                        .setStyle(3),
                        new ButtonBuilder()
                        .setCustomId(`${interaction.user.id}_addcupomdesconto`)
                        .setLabel("Adicionar Cupom de Desconto")
                        .setDisabled(true)
                        .setEmoji("📗")
                        .setStyle(1),
                        new ButtonBuilder()
                        .setCustomId(`${interaction.user.id}_cancelarcarrinho`)
                        .setLabel("Cancelar Compra")
                        .setEmoji("<a:No_cloud:1221871824216920135>")
                        .setStyle(4),
                    )
                ]
            });
        }
        
        if(interaction.isButton() && interaction.customId === "terms") {
            interaction.reply({
                embeds:[
                    new EmbedBuilder().setColor(colorembed)
                    
                    .setTitle(`${interaction.client.user.username} | Termos de compra`)
                    .setDescription(`${await vnd.get("terms")}`)
                ],
                ephemeral:true
            })
        }
        if(custom.endsWith("_cancelarcarrinho")) {
            const userid = custom.split("_")[0];
            if(interaction.user.id !== userid) return;
            if (timer[interaction.channel]) {
                clearTimeout(timer[interaction.channel]);
            }
            const aba = await vnd.get("notifycart");
            if(aba) {
                
            const c = interaction.client.channels.cache.get(await vnd.get("logs_adm"));
            const user = interaction.user;
                if(c) {
                    await c.send({
                        embeds:[
                            new EmbedBuilder().setColor(colorembed)
                            .setTitle(`${interaction.client.user.username} | Compra cancelada`)
                            .setThumbnail(user.displayAvatarURL())
                            .setFooter({text:`${user.id}`, iconURL: user.displayAvatarURL()})
                            .setColor("Red")
                            .addFields(
                                {
                                    name:`${emoji(17)} | Usuário:`,
                                    value:`\`${user.username} - ${user.id}\``
                                },
                                {
                                    name:`${emoji(32)} | Motivo:`,
                                    value:`\`Cancelada pelo usuário.\``
                                },
                                {
                                    name:`${emoji(19)} | Data/ Horário:`,
                                    value:`<t:${Math.floor(new Date() / 1000)}:f> (<t:${Math.floor(new Date() / 1000)}:R>)`
                                }
                            )
                        ]
                    });
                }
            }
                if(interaction.channel) {
                    interaction.channel.delete()
                }

        }
        if(custom.endsWith("_modifyquantia")) {
            if(userid !== interaction.user.id) return;
            const modal = new ModalBuilder()
            .setCustomId(`${id}_${userid}_altquantimodal`)
            .setTitle("✏ | Alterar Quantidade");

            const text = new TextInputBuilder()
            .setCustomId("text")
            .setLabel("quantidade:")
            .setStyle(1)
            .setPlaceholder("1")
            .setMaxLength(3)
            .setRequired(true);

            modal.addComponents(new ActionRowBuilder().addComponents(text));

            return interaction.showModal(modal);
        }
        if(custom.endsWith("_altquantimodal")) {
            const text = parseInt(interaction.fields.getTextInputValue("text"));
            const prod = await db.get(`${id}`);
            if(isNaN(text)) return interaction.reply({content:`${emoji(29)} | Coloque uma quantidade valida! `, ephemeral:true});
            if(text < 1 ) return interaction.reply({content:`${emoji(29)} | Coloque um valor Acima de \`0\`.`, ephemeral:true});
            if(text > prod.conta.length) return interaction.reply({content:`${emoji(29)} | Você só pode adicionar no maximo \`${prod.conta.length}\``, ephemeral:true});
            await carrinho.set(`${chnid}_carrinhoproduto_${id}.quantidade`, text);
            up();
        }
        if(custom.endsWith("_adicionarprod")) {
            if(interaction.user.id !== userid) return;
            const prod = await db.get(`${id}`);
            const cart = await carrinho.get(`${chnid}_carrinhoproduto_${id}.quantidade`);
            if(cart + 1 > prod.conta.length) return interaction.deferUpdate();
            await carrinho.add(`${chnid}_carrinhoproduto_${id}.quantidade`, 1);
            up();
        }
        if(custom.endsWith("_removerprod")) {
            if(interaction.user.id !== userid) return;
            const prod = await db.get(`${id}`);
            const cart = await carrinho.get(`${chnid}_carrinhoproduto_${id}.quantidade`);
            if(cart - 1 <= 0) return interaction.deferUpdate();
            await carrinho.sub(`${chnid}_carrinhoproduto_${id}.quantidade`, 1);
            up();
        }
        if(custom.endsWith("_tirarprod")) {
            if(interaction.user.id !== userid) return;
            await carrinho.delete(`${chnid}_carrinhoproduto_${id}`);
            await interaction.reply({content:`${emoji(11)} | Produto removido com sucesso!`, ephemeral:true});
            interaction.message.delete();
        }
        if(interaction.isButton() && interaction.customId.endsWith("_atualizarstock")) {
            const perereca = interaction.customId.split("_")[0];
            const prod = await db.get(`${perereca}`);
            if(!prod) return interaction.reply({content:`${emoji(12)} | Este Produto foi deletado...`, ephemeral:true});
            
            if(prod.espera.includes(interaction.user.id)) {
                await db.pull(`${perereca}.espera`, (element) => element === interaction.user.id, true);
                interaction.reply({content:`${emoji(11)} | Você já estava com as notificações ativadas, portanto elas foram desativadas.\n**Caso queira ativar só clicar no botão novamente!**`, ephemeral:true});
            } else {
                await db.push(`${perereca}.espera`, interaction.user.id);
                interaction.reply({content:`${emoji(11)} | Notificações ativadas com sucesso!`, ephemeral:true});
            }

        }

        if(interaction.isButton() && interaction.customId.endsWith("_rmb")) {
            if(await token.get("owner") !== interaction.user.id) return interaction.reply({content:`${emoji(12)} | Apenas o Dono do bot pode usar está função!`, ephemeral:true});
            const modal = new ModalBuilder()
            .setCustomId(`${interaction.customId.split("_")[0]}_rmbmodal`)
            .setTitle("🚨 - Reembolso de Compra");

            const text = new TextInputBuilder()
            .setCustomId("text")
            .setLabel("Você tem certeza?")
            .setStyle(1)
            .setMaxLength(3)
            .setMinLength(3)
            .setPlaceholder("SIM")
            .setRequired(true);

            modal.addComponents(new ActionRowBuilder().addComponents(text));

            return interaction.showModal(modal);
        }
        if(interaction.isModalSubmit() && interaction.customId.endsWith("_rmbmodal")) {
            const text = interaction.fields.getTextInputValue("text");
            if(text !== "SIM") return interaction.reply({content:`${emoji(11)} | Cancelado com sucesso!`, ephemeral:true});
            await interaction.reply({content:`${emoji(44)} | Aguarde um momento...`, ephemeral:true});
            try {
                await refund(interaction.customId.split("_")[0], vnd.get("acess_token"));
            } catch(err) {
                interaction.followUp({content:`${emoji(29)} | Ocorreu um erro...\n Mensagem do erro: \`\`\`${err.message}\`\`\``, ephemeral:true});
            } finally {
                await interaction.message.edit({
                    components:[
                        new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                            .setCustomId(`asnduasndysaundas`)
                            .setDisabled(true)
                            .setLabel("Reembolsar")
                            .setStyle(2)
                            .setEmoji("<:Contrato_cloud:1221874795088445490>")
                        )
                    ]
                });
                interaction.editReply({content:`${emoji(11)} | Reembolsado com sucesso!`, ephemeral:true});
            }
        }
        if(interaction.isButton() && interaction.customId === "copiarproduto") {
            const kkk = await entrega.get(`${interaction.message.id}`);
            if(!kkk) return interaction.reply({content:`${emoji(12)} | Acho que acabei perdendo a sua entrega`, ephemeral:true});
            await interaction.update({
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`copiarproduto`)
                        .setStyle(2)
                        .setEmoji("<:carta_cloud:1221878356115591178>")
                        .setLabel("Produto Copiado!")
                        .setDisabled(true),
                    ),
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${id}_atualizarstock`)
                        .setLabel("Avisar atualizações de estoque")
                        .setStyle(2)
                        .setEmoji("<a:Sino:1221877890640121929>"),
                    ),
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setLabel("Comprar novamente")
                        .setStyle(5)
                        .setURL(kkk.url)
                        .setEmoji("<:dinheiro_cloud:1221876449766805504>"),
                    ),
                ]
            });
            interaction.followUp({content:`${kkk.produto}`})
        }
        async function aprovved(idpag, form) {
            if (timer[interaction.channel]) {
                clearTimeout(timer[interaction.channel]);
            }

            await interaction.channel.bulkDelete(10);
            await carrinho.set(`${interaction.channel.id}.status`, "Produto Entregue");
            let dm = true;
            const cart = await carrinho.get(`${interaction.channel.id}`);
            const user = interaction.guild.members.cache.get(cart.userid);
            const role = await interaction.guild.roles.cache.get(await vnd.get("roles_client"));
            if(role) {
                try {
                    if (!user.roles.cache.has(role.id)) {
                        user.roles.add(role.id).then(() => {console.log("Cargo Adicionado")}).catch(() => {console.log("Cargo Removido")});
                    }
                } catch {
                    console.log("Não tenho permissão de dar cargo")
                }
            }
            const primeiracompra = await saldo.get(`${cart.userid}.primeiracompra`);
            if(!primeiracompra) {
                await saldo.set(`${cart.userid}.primeiracompra`, Date.now());
                await saldo.set(`${cart.userid}.ultimacompra`, Date.now());
            } else {
                await saldo.set(`${cart.userid}.ultimacompra`, Date.now());
            }
            

            const all = (await carrinho.all()).filter(a => a.id.startsWith(`${interaction.channel.id}_carrinhoproduto`));
            let totalpagar = 0.00;
            let msg = "";
            let mensagemreembolso = "";

            all.map((a) => {
                const prod = db.get(`${a.value.id}`);
                msg += `${a.value.quantidade}x ${prod.nome} | R$${prod.preco * a.value.quantidade}\n`;
                totalpagar += prod.preco * a.value.quantidade;
            });
            const uaiti = await interaction.channel.send({
                embeds:[
                    new EmbedBuilder().setColor(colorembed)
                    .setTitle(`${emoji(44)} | Pagamento Confirmado!`)
                    .setDescription(`👋 Olá ${user}, Aguarde um momento estou processando os seus produtos...`)
                ]
            });
            const ae = await user.send({
                embeds:[ 
                    new EmbedBuilder().setColor("Green")
                    .setAuthor({name:`Pedido #${interaction.channel.id}`})
                    .setTitle(`${emoji(11)} Pedido Aprovado`)
                    .setDescription(`Seu pagamento foi aprovado, e o processo de entrega já foi iniciado.`)
                    .addFields({
                        name:`Detalhes`,
                        value:`\`${msg}\``
                    })
                    .setFooter({text:`${interaction.guild.name}`, iconURL: interaction.guild.iconURL()})
                    .setTimestamp()
                ]
            }).then(() => {
                dm = true;
            }).catch(() => {
                dm = false;
            });
            if(!dm) { 
                const min = moment().add(5, 'minutes');
                const time = Math.floor(min.valueOf() / 1000);
                await interaction.channel.bulkDelete(10);
                interaction.channel.send({
                    content:`${user} Não foi possível enviar seu pedido na sua DM, então ele foi anexado abaixo, esse carrinho será excluído <t:${time}:R>.`,
                    embeds:[],
                    components:[]
                });
                setInterval(() => {
                    if(interaction.channel) {
                        interaction.channel.delete()
                    }
                }, 5 * 60 * 1000);
            } else {
                const min = moment().add(2, 'minutes');
                const time = Math.floor(min.valueOf() / 1000);
                await interaction.channel.bulkDelete(10);
                interaction.channel.send({
                    content:`${user} Entrega realizada! verifique seu privado, esse carrinho será excluido <t:${time}:R>.`,
                    embeds:[],
                    components:[
                        new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                            .setURL(interaction.user.dmChannel.url)
                            .setLabel("Ir para o pedido entregue")
                            .setStyle(5)
                        )
                    ]
                });
                setInterval(() => {
                    if(interaction.channel) {
                        interaction.channel.delete()
                    }
                }, 2  * 60 * 1000); 
            }
            let entregou = "";
            const logsadm = interaction.client.channels.cache.get(await vnd.get("logs_adm"));
            let x9 = "";
            await all.map((a) => {
                const prod = db.get(`${a.value.id}`);
                const rol = interaction.guild.roles.cache.get(prod.role);
                if(rol) {
                    if(!user.roles.cache.has(rol.id))  {
                        user.roles.add(rol.id).catch(() => {});
                    }
                }

                if(a.value.quantidade <= prod.conta.length) {
                    saldo.add(`${user.id}.compras`, 1);
                    const eee = interaction.guild.channels.cache.get(prod.mensagem.channel);
                    const stock = prod.conta
                    const removed = stock.splice(0, Number(a.value.quantidade)).join("\n");
                    if(a.value.quantidade === prod.conta.length) {
                        const aba = vnd.get("notifyaprovved");
                        if(aba) {
                            if(logsadm) {
                                logsadm.send({content:`<@${token.get("owner")}> Acabou o stock do produto do id: \`${a.value.id}\` Nome: \`${prod.nome}\``});
                            }
                        }
                    } 
                    entregou += `${a.value.quantidade}x ${prod.nome} \n${removed}\n\n`;
                    x9 += `\`${a.value.quantidade}x ${prod.nome} - R$${a.value.quantidade * prod.preco}\`\n`;
                    db.set(`${a.value.id}.conta`, stock);
                    db.add(`${a.value.id}.estatisticas.total`, 1);
                    db.add(`${a.value.id}.estatisticas.rendeu`, Math.ceil(a.value.quantidade * prod.preco));
                    if(!dm) {
                        if(a.value.quantidade < 6) {
                            const mensagem = interaction.channel.send({
                                embeds:[
                                    new EmbedBuilder()
                                    .setAuthor({name:`Pedido #${interaction.channel.id}`})
                                    .setTitle(`${emoji(7)} | Entrega Realizada!`).setDescription("Seu pedido foi anexado a essa mensagem.")
                                    .setColor("#624ae8")
                                    .addFields(
                                        {
                                            name:`Detalhes`,
                                            value:`\`${a.value.quantidade}x ${prod.nome} | R$${prod.preco * a.value.quantidade}\``
                                        },
                                        {
                                            name:`${emoji(30)} Seu Produto Abaixo!`,
                                            value:`${removed}`
                                        }
                                    )
                                    .setFooter({text:`${interaction.guild.name}`, iconURL: interaction.guild.iconURL()})
                                    .setTimestamp()
                                ],
                                components:[
                                    new ActionRowBuilder()
                                    .addComponents(
                                        new ButtonBuilder()
                                        .setCustomId(`copiarproduto`)
                                        .setLabel("Copiar produto entregue")
                                        .setStyle(1)
                                        .setEmoji("<:carta_cloud:1221878356115591178>"),
                                    ),
                                    new ActionRowBuilder()
                                    .addComponents(
                                        new ButtonBuilder()
                                        .setCustomId(`${a.value.id}_atualizarstock`)
                                        .setLabel("Avisar atualizações de estoque")
                                        .setStyle(2)
                                        .setEmoji("<a:Sino:1221877890640121929>"),
                                    ),
                                    new ActionRowBuilder()
                                    .addComponents(
                                        new ButtonBuilder()
                                        .setLabel("Comprar novamente")
                                        .setStyle(5)
                                        .setURL(eee?.url ?? interaction.channel.url)
                                        .setEmoji("<:dinheiro_cloud:1221876449766805504>"),
                                    ),
                                ]
                            }).then((mensagem) => {
                                entrega.set(`${mensagem.id}`, {
                                    produto: `${removed}`,
                                    url: `${eee?.url ?? interaction.channel.url}`,
                                    id: `${a.value.id}`
                                });
                            });
                        } else {
                            fs.writeFileSync('pedido.txt', removed);
                            interaction.channel.send({
                                embeds:[
                                    new EmbedBuilder()
                                    .setAuthor({name:`Pedido #${interaction.channel.id}`})
                                    .setTitle(`${emoji(7)} | Entrega Realizada!`).setDescription("Seu pedido foi anexado a essa mensagem.")
                                    .setColor("#624ae8")
                                    .addFields(
                                        {
                                            name:`Detalhes`,
                                            value:`\`${a.value.quantidade}x ${prod.nome} | R$${prod.preco * a.value.quantidade}\``
                                        }
                                    )
                                    .setFooter({text:`${interaction.guild.name}`, iconURL: interaction.guild.iconURL()})
                                    .setTimestamp()
                                ],
                                components:[
                                    new ActionRowBuilder()
                                    .addComponents(
                                        new ButtonBuilder()
                                        .setCustomId(`${a.value.id}_atualizarstock`)
                                        .setLabel("Avisar atualizações de estoque")
                                        .setStyle(2)
                                        .setEmoji("<a:Sino:1221877890640121929>"),
                                    ),
                                    new ActionRowBuilder()
                                    .addComponents(
                                        new ButtonBuilder()
                                        .setLabel("Comprar novamente")
                                        .setStyle(5)
                                        .setURL(eee?.url ?? interaction.channel.url)
                                        .setEmoji("<:dinheiro_cloud:1221876449766805504>"),
                                    ),
                                ],
                                files: ['pedido.txt'],
                            });
                        }
                    } else {
                        const eee = interaction.guild.channels.cache.get(prod.mensagem.channel);
                        if(a.value.quantidade < 6) {
                            const mensagem= user.send({
                                embeds:[
                                    new EmbedBuilder()
                                    .setAuthor({name:`Pedido #${interaction.channel.id}`})
                                    .setTitle(`${emoji(7)} | Entrega Realizada!`).setDescription("Seu pedido foi anexado a essa mensagem.")
                                    .setColor("#624ae8")
                                    .addFields(
                                        {
                                            name:`Detalhes`,
                                            value:`\`${a.value.quantidade}x ${prod.nome} | R$${prod.preco * a.value.quantidade}\``
                                        },
                                        {
                                            name:`${emoji(30)} Seu Produto Abaixo!`,
                                            value:`${removed}`
                                        }
                                    )
                                    .setFooter({text:`${interaction.guild.name}`, iconURL: interaction.guild.iconURL()})
                                    .setTimestamp()
                                ],
                                components:[
                                    new ActionRowBuilder()
                                    .addComponents(
                                        new ButtonBuilder()
                                        .setCustomId(`copiarproduto`)
                                        .setLabel("Copiar produto entregue")
                                        .setStyle(1)
                                        .setEmoji("<:carta_cloud:1221878356115591178>"),
                                    ),
                                    new ActionRowBuilder()
                                    .addComponents(
                                        new ButtonBuilder()
                                        .setCustomId(`${a.value.id}_atualizarstock`)
                                        .setLabel("Avisar atualizações de estoque")
                                        .setStyle(2)
                                        .setEmoji("<a:Sino:1221877890640121929>"),
                                    ),
                                    new ActionRowBuilder()
                                    .addComponents(
                                        new ButtonBuilder()
                                        .setLabel("Comprar novamente")
                                        .setStyle(5)
                                        .setURL(eee?.url ?? interaction.channel.url)
                                        .setEmoji("<:dinheiro_cloud:1221876449766805504>"),
                                    ),
                                ]
                            }).then((mensagem) => {
                                entrega.set(`${mensagem.id}`, {
                                    produto: removed,
                                    url: `${eee?.url ?? interaction.channel.url}`,
                                    id: `${a.value.id}`
                                });
                            });
                        } else {
                            fs.writeFileSync('pedido.txt', removed);
                            user.send({
                                embeds:[
                                    new EmbedBuilder()
                                    .setAuthor({name:`Pedido #${interaction.channel.id}`})
                                    .setTitle(`${emoji(7)} | Entrega Realizada!`).setDescription("Seu pedido foi anexado a essa mensagem.")
                                    .setColor("#624ae8")
                                    .addFields(
                                        {
                                            name:`Detalhes`,
                                            value:`\`${a.value.quantidade}x ${prod.nome} | R$${prod.preco * a.value.quantidade}\``
                                        }
                                    )
                                    .setFooter({text:`${interaction.guild.name}`, iconURL: interaction.guild.iconURL()})
                                    .setTimestamp()
                                ],
                                components:[
                                    new ActionRowBuilder()
                                    .addComponents(
                                        new ButtonBuilder()
                                        .setCustomId(`${a.value.id}_atualizarstock`)
                                        .setLabel("Avisar atualizações de estoque")
                                        .setStyle(2)
                                        .setEmoji("<a:Sino:1221877890640121929>"),
                                    ),
                                    new ActionRowBuilder()
                                    .addComponents(
                                        new ButtonBuilder()
                                        .setLabel("Comprar novamente")
                                        .setStyle(5)
                                        .setURL(eee?.url ?? interaction.channel.url)
                                        .setEmoji("<:dinheiro_cloud:1221876449766805504>"),
                                    ),
                                ],
                                files: ['pedido.txt'],
                            });
                        
                        }
                    }
                } else {
                    const e = prod.preco * a.value.quantidade;
                    if(!dm) {
                        if(form === "automatico") {
                            mensagemreembolso = `Um usuario comprou primeiro que você, Foi Reembolsado o valor dê \`R$${prod.preco * a.value.quantidade}\``;
                            refundparcial(idpag, e, vnd.get("acess_token"))
                        } else if(form === "aprovado") {
                            mensagemreembolso = `Um usuario comprou primeiro que você, Verifique com o Dono para Reembolsar o Valor dê: \`R$${prod.preco * a.value.quantidade}\``
                        } else if(form === "saldo") {
                            mensagemreembolso = `Um usuario comprou primeiro que você, Foi Retornado o seu Saldo no valor dê \`R$${prod.preco * a.value.quantidade}\``;
                            saldo.add(`${user.id}.saldo`, e.toFixed(2));
                        }
                        const eee = interaction.guild.channels.cache.get(prod.mensagem.channel);
                            interaction.channel.send({
                                embeds:[
                                    new EmbedBuilder()
                                    .setAuthor({name:`Pedido #${interaction.channel.id}`})
                                    .setTitle(`${emoji(7)} | Espere, Aguarde um momento.`)
                                    .setColor("#624ae8")
                                    .addFields(
                                        {
                                            name:`Detalhes`,
                                            value:`\`${a.value.quantidade}x ${prod.nome} | R$${prod.preco * a.value.quantidade}\``
                                        },
                                        {
                                            name:`${emoji(20)} Houve um Problema neste produto!`,
                                            value:`${mensagemreembolso}`
                                        }
                                    )
                                    .setFooter({text:`${interaction.guild.name}`, iconURL: interaction.guild.iconURL()})
                                    .setTimestamp()
                                ],
                                components:[
                                    new ActionRowBuilder()
                                    .addComponents(
                                        new ButtonBuilder()
                                        .setCustomId(`${a.value.id}_atualizarstock`)
                                        .setLabel("Avisar atualizações de estoque")
                                        .setStyle(2)
                                        .setEmoji("<a:Sino:1221877890640121929>"),
                                    ),
                                    new ActionRowBuilder()
                                    .addComponents(
                                        new ButtonBuilder()
                                        .setLabel("Localização Produto")
                                        .setStyle(5)
                                        .setURL(eee?.url ?? interaction.channel.url)
                                        .setEmoji("<:dinheiro_cloud:1221876449766805504>"),
                                    ),
                                ]
                            })
                    } else {
                        const eee = interaction.guild.channels.cache.get(prod.mensagem.channel);
                        if(form === "automatico") {
                            mensagemreembolso = `Um usuario comprou primeiro que você, Foi Reembolsado o valor dê \`R$${prod.preco * a.value.quantidade}\``;
                            refundparcial(idpag, e, vnd.get("acess_token"))
                        } else if(form === "manual") {
                            mensagemreembolso = `Um usuario comprou primeiro que você, Verifique com o Dono para Reembolsar o Valor dê: \`R$${prod.preco * a.value.quantidade}\``
                        } else if(form === "saldo") {
                            mensagemreembolso = `Um usuario comprou primeiro que você, Foi Retornado o seu Saldo no valor dê \`R$${prod.preco * a.value.quantidade}\``;
                            saldo.add(`${user.id}.saldo`, e.toFixed(2));
                        }

                            user.send({
                                embeds:[
                                    new EmbedBuilder()
                                    .setAuthor({name:`Pedido #${interaction.channel.id}`})
                                    .setTitle(`${emoji(7)} | Espere, Aguarde um momento.`)
                                    .setColor("#624ae8")
                                    .addFields( 
                                        {
                                            name:`Detalhes`,
                                            value:`\`${a.value.quantidade}x ${prod.nome} | R$${prod.preco * a.value.quantidade}\``
                                        },
                                        {
                                            name:`${emoji(20)} Houve um Problema neste produto!`,
                                            value:`${mensagemreembolso}`
                                        }
                                    )
                                    .setFooter({text:`${interaction.guild.name}`, iconURL: interaction.guild.iconURL()})
                                    .setTimestamp()
                                ],
                                components:[
                                    new ActionRowBuilder()
                                    .addComponents(
                                        new ButtonBuilder()
                                        .setCustomId(`${a.value.id}_atualizarstock`)
                                        .setLabel("Avisar atualizações de estoque")
                                        .setStyle(2)
                                        .setEmoji("<a:Sino:1221877890640121929>"),
                                    ),
                                    new ActionRowBuilder()
                                    .addComponents(
                                        new ButtonBuilder()
                                        .setLabel("Localização Produto")
                                        .setStyle(5)
                                        .setURL(eee?.url ?? interaction.channel.url)
                                        .setEmoji("<:dinheiro_cloud:1221876449766805504>"),
                                    ),
                                ]
                            })
                        }
                    }
            });

            
            rd.add("pedidostotal", 1);
            rd.add("gastostotal", totalpagar.toFixed(2));
            rd.add(`${moment().format('L')}.pedidos`, 1);
            rd.add(`${moment().format('L')}.recebimentos`, totalpagar.toFixed(2));
            saldo.add(`${user.id}.gasto`, totalpagar.toFixed(2));

            const feed = interaction.client.channels.cache.get(await vnd.get("channel_fedback"));
            if(feed) {
                const kas = await feed.send({content:`${user}`})
                kas.delete();
                
                if(dm) {
                    setTimeout(() => {
                        user.send({
                            content:`Oii, ${user}, deu tudo certo como deveria? não se esqueça de nos dar seu feedback, caso ainda não tenha feito.`,
                            components:[
                                new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                    .setStyle(5)
                                    .setLabel("Clique aqui e deixe seu feedback ;)")
                                    .setURL(feed.url)
                                )
                            ]
                        })
                    }, 1 * 60 * 1000);
                }
            }
            const logspublic = interaction.client.channels.cache.get(await vnd.get("logs_public"));
            if(logspublic) {
                logspublic.send({
                    embeds:[
                        new EmbedBuilder()
                        .setAuthor({name:`${user.user.username}`, iconURL: user.displayAvatarURL()})
                        .setTitle(`${emoji(4)} Compra Realizada!`)
                        .setThumbnail(user.displayAvatarURL())
                        .addFields(
                            {
                                name:"Carrinho",
                                value:`${x9}`
                            },
                            {
                                name:"Valor Pago",
                                value:`\`R$ ${totalpagar.toFixed(2)}\``
                            },
                            {
                                name:"Data/Horaio",
                                value:`<t:${Math.floor(new Date()/ 1000)}:f>`
                            }
                        )
                        .setFooter({text:`${interaction.guild.name}`, iconURL: interaction.guild.iconURL()})
                        .setTimestamp()
                    ]
                })
            }
            
            const aba = await vnd.get("notifyaprovved");
            if(aba) {
                if(logsadm) {
                    fs.writeFileSync('entrega.txt', entregou);
                    logsadm.send({
                        embeds:[
                            new EmbedBuilder()
                            .setAuthor({name:`Pedido #${interaction.channel.id}`})
                            .setTitle(`${emoji(7)} | Nova Compra!`).setDescription("O pedido foi anexado a essa mensagem.")
                            .setColor(bot.get("cor"))
                            .addFields(
                                {
                                    name:"Comprador",
                                    value:`${user} - \`${user.user.username}\``
                                }, 
                                {
                                    name:"Data",
                                    value:`<t:${Math.floor(new Date() / 1000)}:f>`,
                                },
                                {
                                    name:`Carrinho:`,
                                    value:`${x9}`
                                },
                                {
                                    name:`Valor Pago`,
                                    value:`\`R$${totalpagar}\``
                                },
                                {
                                    name:"Cupom que foi Utilizado",
                                    value:`\`${cart.cupom}\``
                                },
                            )
                            .setFooter({text:`${interaction.guild.name}`, iconURL: interaction.guild.iconURL()})
                            .setTimestamp()
                        ],
                        files:["entrega.txt"],
                        components:[
                            new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                .setCustomId(`${idpag}_rmb`)
                                .setLabel("Reembolsar")
                                .setStyle(2)
                                .setEmoji("<:Contrato_cloud:1221874795088445490>")
                            )
                        ]
                    })
                } 
            }
        } 
        async function edit() {
            const prod = await db.get(`${id}`);
            const embed = new EmbedBuilder().setColor(colorembed)
            .setColor(prod.cor);
 
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
            if(prod.banner?.startsWith("https://"))embed.setImage(prod.banner);
            if(prod.miniatura?.startsWith("https://")) embed.setThumbnail(prod.miniatura);
            if(prod?.rodape !== "Sem Rodapé") embed.setFooter({text:`${prod.rodape}`})

            const row = 
            new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId(`${id}_produto`)
                .setLabel(`${mensagem_compra.button.text}` ?? "Comprar")
                .setStyle(Number(mensagem_compra.button.style) ?? 3)
                .setEmoji(`${mensagem_compra.button.emoji}` ?? "<:Carrinho_black:1178025995488464979>")
            )
            const duvidas = await bot.get("duvidas");
            if(duvidas.status) {
                const channel = interaction.guild.channels.cache.get(duvidas.channel) || interaction.channel;
                row.addComponents(
                    new ButtonBuilder()
                    .setStyle(5)
                    .setLabel(duvidas.label)
                    .setEmoji(duvidas.emoji)
                    .setURL(channel.url)
                );
            }
       
    await interaction.message.edit({ embeds: [embed],
     components:[
        row
     ]})
        }
        async function editpainel(id) {
            const prod = await pn.get(`${id}`);
    const select = new StringSelectMenuBuilder().setCustomId(`${id}_painel`).setMaxValues(1).setPlaceholder(prod.placeholder);
    await prod.produtos.forEach((pede) => {
        const prod = db.get(`${pede.id}`);
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
    if(prod?.rodape !== "Sem Rodapé") {
        embed?.setFooter({text:`${prod.rodape}`});
    }
    await interaction.message.edit({
        embeds: [embed],
        components:[
            new ActionRowBuilder() 
            .addComponents(
                select
            )
        ]
       })
        }
        async function up() {
            const datab = await carrinho.get(`${interaction.channel.id}_carrinhoproduto_${id}`);
            const prod = await db.get(`${id}`);
            await interaction.update({
                    embeds:[
                        new EmbedBuilder().setColor(colorembed)
                        
                        .setDescription(`${personalizar.get("0")} | **Produto:** \`${prod.nome}\`\n\n${personalizar.get("4")} | **Quantidade:** \`${datab.quantidade}\`\n\n${personalizar.get("3")} | **Preço:** \`R$${prod.preco * datab.quantidade}\`\n\n${personalizar.get("14")} | **Quantidade disponivel:** \`${prod.conta.length}\``)
                    ],
                    components:[
                        new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                            .setCustomId(`${id}_${interaction.user.id}_adicionarprod`)
                            .setLabel("+")
                            .setStyle(2),
                            new ButtonBuilder()
                            .setCustomId(`${id}_${interaction.user.id}_modifyquantia`)
                            .setLabel("✏️")
                            .setStyle(3),
                            new ButtonBuilder()
                            .setCustomId(`${id}_${interaction.user.id}_removerprod`)
                            .setLabel("-")
                            .setStyle(2),
                            new ButtonBuilder()
                            .setCustomId(`${id}_${interaction.user.id}_tirarprod`)
                            .setEmoji("<:lixo_cloud:1221875710956797992>")
                            .setStyle(4),
                        )
                    ]
                });
        }
        async function refund(id, acesstoken) {
            try {
                await axios.post(`https://api.mercadopago.com/v1/payments/${id}/refunds`, {}, {
                  headers: {
                    Authorization: `Bearer ${acesstoken}`
                  }
                })
                

              } catch (error) {
              }
            
        }
        async function refundparcial(id, amount, acesstoken) {
            try {
                await axios.post(`https://api.mercadopago.com/v1/payments/${id}/refunds`,   {
                    'amount': amount
                  }, {
                  headers: {
                    Authorization: `Bearer ${acesstoken}`
                  }
                })
              } catch (error) {
              }
            
        }
        
        function resettime(chn) {
            const cooldown = vnd.get("tempmax");
           if(chn) {
            if (timer[chn.id]) {
                clearTimeout(timer[chn.id]);
            }
            timer[chn.id] = setTimeout(async () => {
                const cha = interaction.client.channels.cache.get(chn.id);
                if(cha) {
                    
                const user = interaction.user;
                const asdasd = vnd.get("notifycart");
                if(asdasd) { 
                    const c = interaction.client.channels.cache.get(await vnd.get("logs_adm"));
                    if(c) {
    
                        await c.send({
                            embeds:[
                                new EmbedBuilder().setColor(colorembed)
                                .setTitle(`${interaction.client.user.username} | Compra cancelada`)
                                .setThumbnail(user.displayAvatarURL())
                                .setFooter({text:`${user.id}`, iconURL: user.displayAvatarURL()})
                                .setColor("Red")
                                .addFields(
                                    {
                                        name:`${emoji(17)} | Usuário:`,
                                        value:`\`${user.username} - ${user.id}\``
                                    },
                                    {
                                        name:`${emoji(32)} | Motivo:`,
                                        value:`\`Cancelada por inatividade.\``
                                    },
                                    {
                                        name:`${emoji(19)} | Data/ Horário:`,
                                        value:`<t:${Math.floor(new Date() / 1000)}:f> (<t:${Math.floor(new Date() / 1000)}:R>)`
                                    }
                                )
                            ]
                        });
                    }
                }
                user.send({
                    embeds:[
                        new EmbedBuilder().setColor(colorembed)
                        .setTitle(`${interaction.client.user.username} | Compra Cancelada`)
                        .setDescription(`Olá ${user}, \n\n• A sua compra foi cancelada por **inatividade**, e todos os produtos foram devolvidos para o estoque. Você pode voltar a comprar quando quiser!`)
                        .setColor("Red")
                    ],
                }).catch(() => {});
                await chn.delete(); 
                }
            }, Number(cooldown) *60* 1000);
            }
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