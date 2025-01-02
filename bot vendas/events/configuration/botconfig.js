const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, ActivityType, StringSelectMenuBuilder, ChannelSelectMenuBuilder, ChannelType, RoleSelectMenuBuilder } = require("discord.js");
const {bot,carrinho,db,logs,pn,rd,vnd, token, personalizar} = require("../../database/index"); 
let timer = {};
const axios = require("axios");
const { VoiceConnectionDisconnectReason } = require("@discordjs/voice");
const moment = require("moment");
const emojiRegex = require('emoji-regex');



module.exports = {
    name:"interactionCreate", // Nome do Evento 
    run: async( interaction, client) => {
        const customId = interaction.customId;
        if(!customId) return;
        const userid = customId.split("_")[0];

        if(interaction.user.id !== userid) return;
        if(interaction.isButton()){
            if(customId.endsWith("_vendasonoff")) {
                resettime()
                if(await vnd.get(`vendas`) === true) {
                   await vnd.set(`vendas`, false)
                   const vend = false
                   await interaction.update({
                       content:``,
                       embeds:[
                           new EmbedBuilder()
                           .setThumbnail(interaction.client.user.displayAvatarURL())
                           .setAuthor({name:`${interaction.client.user.username}`, iconURL:interaction.client.user.displayAvatarURL()})
                           .setTitle(`${emoji(5)} **| Painel de Configuração do bot**`)
                           .setDescription(`${emoji(5)} | Sistema de Vendas: ${vend === true ? "ON" : "OFF"}\n\n**Use os botões abaixo para configurar seu bot:**\n[Link Para Add o Bot](https://discord.com/api/oauth2/authorize?client_id=${interaction.client.user.id}&permissions=8&scope=bot%20applications.commands)`)
                       ],
                       components:[
                           new ActionRowBuilder()
                           .addComponents(
                               new ButtonBuilder()
                               .setCustomId(`${interaction.user.id}_vendasonoff`)
                               .setLabel("Vendas On/Off")
                               .setStyle(vend === true ? 3 : 4)
                               .setEmoji("<:config_cloud:1213558269633892352>"),
                               new ButtonBuilder()
                               .setCustomId(`${interaction.user.id}_configpag`)
                               .setLabel("Configurar Pagamento")
                               .setStyle(1)
                               .setEmoji("<:Contrato_cloud:1221874795088445490>"),
                               new ButtonBuilder()
                               .setCustomId(`${interaction.user.id}_configbot`)
                               .setLabel("Configurar Bot")
                               .setStyle(1)
                               .setEmoji("<a:planeta_cloud:1221858904015765524>"),
                               new ButtonBuilder()
                               .setCustomId(`${interaction.user.id}_configchannel`)
                               .setLabel("Configurar Canais")
                               .setStyle(1)
                               .setEmoji("<:engrenagem_cloud:1213652588571004959>"),
                               new ButtonBuilder()
                               .setCustomId(`${interaction.user.id}_configterms`)
                               .setLabel("Configurar os Termos de compra")
                               .setStyle(1)
                               .setEmoji("<:folha_cloud:1221870992817782936>"),
                           ),
                           new ActionRowBuilder()
                           .addComponents(
                            new ButtonBuilder()
                            .setCustomId(`${interaction.user.id}_buttonconfigduvida`)
                            .setLabel("Botão Dúvidas")
                            .setEmoji("<:click_cloud:1213554785366835230>")
                            .setStyle(1),
                            new ButtonBuilder()
                            .setCustomId(`${interaction.user.id}_configmod123`)
                            .setLabel("Configurar Moderação")
                            .setEmoji("<:escudo_cloud:1213554942061711410>")
                            .setStyle(1)
                           )
                       ]
                   });
                   await interaction.followUp({
                    embeds:[
                        new EmbedBuilder()
                        .setDescription(`Olá ${interaction.user}, o sistema de vendas foi \`desativado\`.`)
                    ],
                    ephemeral:true
                   })
                } else {
                    await vnd.set(`vendas`, true)
                    const vend = true
                    await interaction.update({
                        content:``,
                        embeds:[
                            new EmbedBuilder()
                            .setThumbnail(interaction.client.user.displayAvatarURL())
                            .setAuthor({name:`${interaction.client.user.username}`, iconURL:interaction.client.user.displayAvatarURL()})
                            .setTitle(`${emoji(5)} **| Painel de Configuração do bot**`)
                            .setDescription(`${emoji(5)} | Sistema de Vendas: ${vend === true ? "ON" : "OFF"}\n\n**Use os botões abaixo para configurar seu bot:**\n[Link Para Add o Bot](https://discord.com/api/oauth2/authorize?client_id=${interaction.client.user.id}&permissions=8&scope=bot%20applications.commands)`)
                        ],
                        components:[
                            new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                .setCustomId(`${interaction.user.id}_vendasonoff`)
                                .setLabel("Vendas On/Off")
                                .setStyle(vend === true ? 3 : 4)
                                .setEmoji("<:config_cloud:1213558269633892352>"),
                                new ButtonBuilder()
                                .setCustomId(`${interaction.user.id}_configpag`)
                                .setLabel("Configurar Pagamento")
                                .setStyle(1)
                                .setEmoji("<:Contrato_cloud:1221874795088445490>"),
                                new ButtonBuilder()
                                .setCustomId(`${interaction.user.id}_configbot`)
                                .setLabel("Configurar Bot")
                                .setStyle(1)
                                .setEmoji("<a:planeta_cloud:1221858904015765524>"),
                                new ButtonBuilder()
                                .setCustomId(`${interaction.user.id}_configchannel`)
                                .setLabel("Configurar Canais")
                                .setStyle(1)
                                .setEmoji("<:engrenagem_cloud:1213652588571004959>"),
                                new ButtonBuilder()
                                .setCustomId(`${interaction.user.id}_configterms`)
                                .setLabel("Configurar os Termos de compra")
                                .setStyle(1)
                                .setEmoji("<:folha_cloud:1221870992817782936>"),
                            ),
                            new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                .setCustomId(`${interaction.user.id}_buttonconfigduvida`)
                                .setLabel("Botão Dúvidas")
                                .setEmoji("<:click_cloud:1213554785366835230>")
                                .setStyle(1),
                                new ButtonBuilder()
                                .setCustomId(`${interaction.user.id}_configmod123`)
                                .setLabel("Configurar Moderação")
                                .setEmoji("<:escudo_cloud:1213554942061711410>")
                                .setStyle(1)
                            )
                        ]
                    });
                    await interaction.followUp({
                     embeds:[
                         new EmbedBuilder()
                         .setDescription(`Olá ${interaction.user}, o sistema de vendas foi \`desativado\`.`)
                     ],
                     ephemeral:true
                    })
                }
            }
            
            if(customId.endsWith("_configpag")) {
                resettime()
                interaction.update({
                    
            embeds:[
                new EmbedBuilder()
                .setThumbnail(interaction.client.user.displayAvatarURL())
                .setAuthor({name:`${interaction.client.user.username}`, iconURL:interaction.client.user.displayAvatarURL()})
                .setTitle(`${emoji(5)} **| Painel de Configuração do bot**`)
                .setDescription(`Selecione o Sistema que Deseja configurar:`)
                .setColor("Random")
            ],
            components:[
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId(`${interaction.user.id}_mpconfig`)
                    .setLabel("Mercado Pago")
                    .setStyle(1)
                    .setEmoji("<:MercadoPago:1221877449340752002>"), 
                    new ButtonBuilder()
                    .setCustomId(`${interaction.user.id}_saldoconfig`)
                    .setLabel("Saldo")
                    .setStyle(1)
                    .setEmoji("💰"),
                    new ButtonBuilder()
                    .setCustomId(`${interaction.user.id}_semiautoconfig`)
                    .setLabel("Pagamento Semiauto")
                    .setStyle(1)
                    .setEmoji("<:Dinheiro_cloud:1221872674188562443>"),
                    new ButtonBuilder()
                    .setCustomId(`${interaction.user.id}_voltar`)
                    .setLabel("Voltar")
                    .setStyle(2)
                    .setEmoji("⬅"),
                )
            ]
                })
            }
            if(customId.endsWith("_saldoconfig")) {
                resettime();
                saldo();
            }


            if(customId.endsWith("_mpconfig")) {
                resettime()
                mp();
            }

            if(customId.endsWith("_pixonoff")) {
                resettime()
                if(vnd.get(`pix`) === true) {
                    await vnd.set(`pix`, false)
                    await mp();
                    interaction.followUp({
                        embeds:[
                            new EmbedBuilder()
                            .setDescription(`Olá ${interaction.user}, o sistema de Pix do Mp foi \`desativado\`.`)
                        ],
                        ephemeral:true
                    })
            } else {
                    await vnd.set(`pix`, true)
                    await mp();
                    interaction.followUp({
                        embeds:[
                            new EmbedBuilder()
                            .setDescription(`Olá ${interaction.user}, o sistema de Pix do Mp foi \`ativado\`.`)
                        ],
                        ephemeral:true
                    })
            }
            }

            if(customId.endsWith("_siteonoff")) {
                resettime()
                if(vnd.get(`pagarsite`) === true) {
                    await vnd.set(`pagarsite`, false)
                    await mp();
                    interaction.followUp({
                        embeds:[
                            new EmbedBuilder()
                            .setDescription(`Olá ${interaction.user}, o sistema de Pagamento pelo Site do Mp foi \`desativado\`.`)
                        ],
                        ephemeral:true
                    })
            } else {
                    await vnd.set(`pagarsite`, true)
                    await mp();
                    interaction.followUp({
                        embeds:[
                            new EmbedBuilder()
                            .setDescription(`Olá ${interaction.user}, o sistema de Pagamento pelo Site do Mp foi \`ativado\`.`)
                        ],
                        ephemeral:true
                    })
            }
            }

            if(customId.endsWith("_voltar")){
                resettime()
                
        const vend = await vnd.get(`vendas`);

        interaction.update({
            content:``,
            embeds:[
                new EmbedBuilder()
                .setThumbnail(interaction.client.user.displayAvatarURL())
                .setAuthor({name:`${interaction.client.user.username}`, iconURL:interaction.client.user.displayAvatarURL()})
                .setTitle(`${emoji(5)} **| Painel de Configuração do bot**`)
                .setDescription(`${emoji(5)} | Sistema de Vendas: ${vend === true ? "ON" : "OFF"}\n\n**Use os botões abaixo para configurar seu bot:**\n[Link Para Add o Bot](https://discord.com/api/oauth2/authorize?client_id=${interaction.client.user.id}&permissions=8&scope=bot%20applications.commands)`)
            ],
            components:[
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId(`${interaction.user.id}_vendasonoff`)
                    .setLabel("Vendas On/Off")
                    .setStyle(vend === true ? 3 : 4)
                    .setEmoji("<:config_cloud:1213558269633892352>"),
                    new ButtonBuilder()
                    .setCustomId(`${interaction.user.id}_configpag`)
                    .setLabel("Configurar Pagamento")
                    .setStyle(1)
                    .setEmoji("<:Contrato_cloud:1221874795088445490>"),
                    new ButtonBuilder()
                    .setCustomId(`${interaction.user.id}_configbot`)
                    .setLabel("Configurar Bot")
                    .setStyle(1)
                    .setEmoji("<a:planeta_cloud:1221858904015765524>"),
                    new ButtonBuilder()
                    .setCustomId(`${interaction.user.id}_configchannel`)
                    .setLabel("Configurar Canais")
                    .setStyle(1)
                    .setEmoji("<:engrenagem_cloud:1213652588571004959>"),
                    new ButtonBuilder()
                    .setCustomId(`${interaction.user.id}_configterms`)
                    .setLabel("Configurar os Termos de compra")
                    .setStyle(1)
                    .setEmoji("<:folha_cloud:1221870992817782936>"),
                ),
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId(`${interaction.user.id}_buttonconfigduvida`)
                    .setLabel("Botão Dúvidas")
                    .setEmoji("<:click_cloud:1213554785366835230>")
                    .setStyle(1),
                    new ButtonBuilder()
                    .setCustomId(`${interaction.user.id}_configmod123`)
                    .setLabel("Configurar Moderação")
                    .setEmoji("<:escudo_cloud:1213554942061711410>")
                    .setStyle(1)
                )
            ]
        });
            }

            if(customId.endsWith("_configterms")) {
                const modal = new ModalBuilder()
                .setCustomId(`${userid}_termsmodal`)
                .setTitle("🔧 | Alterar Termos de Compra");

                const text = new TextInputBuilder()
                .setCustomId("text")
                .setLabel("TERMOS DE COMPRA:")
                .setStyle(2)
                .setMaxLength(3500)
                .setRequired(true);

                modal.addComponents(new ActionRowBuilder().addComponents(text));

                return interaction.showModal(modal);
            }
            if(customId.endsWith("_configbot")){
                resettime();
                botp()

            }
            if(customId.endsWith("_temppagar")) {
                resettime()
                const modal = new ModalBuilder()
                .setCustomId(`${userid}_tempa_modal`)
                .setTitle("🕗 | Alterar Tempo");

                const text = new TextInputBuilder()
                .setCustomId("text")
                .setLabel("TEMPO: (ENTRE 5 A 20 MINUTOS)")
                .setStyle(1)
                .setPlaceholder("10")
                .setMaxLength(2)
                .setMinLength(1)
                .setRequired(true);

                modal.addComponents(new ActionRowBuilder().addComponents(text));

                return interaction.showModal(modal)
            }

            if(customId.endsWith("_altacesstoken")) {
                resettime()
                const modal = new ModalBuilder()
                .setCustomId(`${userid}_acesstoken_modal`)
                .setTitle("🔧 | Alterar Acess Token");

                const text = new TextInputBuilder()
                .setCustomId("text")
                .setLabel("NOVO ACESS TOKEN:")
                .setStyle(1)
                .setRequired(true);

                modal.addComponents(new ActionRowBuilder().addComponents(text));

                return interaction.showModal(modal);
            } 

            if(customId.endsWith("_saldoonoff")) {
                resettime()
                if(await vnd.get(`saldo`) === true) {
                    await vnd.set(`saldo`, false);
                    await saldo();
                    await interaction.followUp({embeds:[new EmbedBuilder().setDescription(`Olá ${interaction.user}, o sistema de Saldo foi \`desativado\`.`)], ephemeral:true})
                } else {
                    await vnd.set(`saldo`, true);
                    await saldo();
                    await interaction.followUp({embeds:[new EmbedBuilder().setDescription(`Olá ${interaction.user}, o sistema de Saldo foi \`ativado\`.`)], ephemeral:true})
                }
            }
            if(customId.endsWith("_bonusdep")){
                resettime();
                const modal = new ModalBuilder()
                .setCustomId(`${userid}_depmodal`)
                .setTitle(`💰 | Bônus por depósito`);

                const text = new TextInputBuilder()
                .setCustomId("text")
                .setLabel("Porcentagem do Bõnus:")
                .setStyle(1)
                .setMaxLength(3)
                .setRequired(true)
                .setPlaceholder("10");

                const text1 = new TextInputBuilder()
                .setCustomId("text1")
                .setLabel("Valor mínimo de depósito:")
                .setStyle(1)
                .setMaxLength(4)
                .setRequired(true)
                .setPlaceholder("5");

                modal.addComponents(new ActionRowBuilder().addComponents(text));
                modal.addComponents(new ActionRowBuilder().addComponents(text1));

                return interaction.showModal(modal);
            }
            if(customId.endsWith("_semiautoconfig")) {
                resettime();
                semiauto()
            }

            if(customId.endsWith("_semiautoonoff")) {
                resettime()
                if(await vnd.get(`semiauto`) === true) {
                    await vnd.set(`semiauto`, false);
                    await semiauto();
                    await interaction.followUp({embeds:[new EmbedBuilder().setDescription(`Olá ${interaction.user}, o sistema de Pagamento Semi Automático foi \`desativado\`.`)], ephemeral:true})
                } else {
                    await vnd.set(`semiauto`, true);
                    await semiauto();
                    await interaction.followUp({embeds:[new EmbedBuilder().setDescription(`Olá ${interaction.user}, o sistema de Pagamento Semi Automático foi \`ativado\`.`)], ephemeral:true})
                }
            }

            if(customId.endsWith("_chavepix")) {
                resettime();

                const modal = new ModalBuilder()
                .setTitle("⚙ | Alterar Chave Pix")
                .setCustomId(`${userid}_chavepixmodal`);

                const text = new TextInputBuilder()
                .setStyle(1)
                .setLabel("TIPO DE CHAVE:")
                .setCustomId("text")
                .setMaxLength(30)
                .setRequired(true)
                .setPlaceholder("Email, Cpf, Aleatória, etc.");

                const text1 = new TextInputBuilder()
                .setStyle(1)
                .setLabel("CHAVE:")
                .setMaxLength(100)
                .setRequired(true)
                .setCustomId("text1")
                .setPlaceholder("WhiteX@bunitu.com");

                modal.addComponents(new ActionRowBuilder().addComponents(text));
                modal.addComponents(new ActionRowBuilder().addComponents(text1));

                return interaction.showModal(modal);
            }

            if(customId.endsWith("_qrcode")){
                resettime();
                const modal = new ModalBuilder()
                .setTitle("🔧 | Alterar Qr Code")
                .setCustomId(`${userid}_qrcodemodal`);

                const text = new TextInputBuilder()
                .setCustomId("text")
                .setLabel("LINK DA IMAGEM DO QR CODE:")
                .setStyle(1)
                .setRequired(true)
                .setPlaceholder("Caso queira remover, digite: \"remover\"");

                modal.addComponents(new ActionRowBuilder().addComponents(text));

                return interaction.showModal(modal);
            }

            if(customId.endsWith("_alterarnome")){
                resettime()
                const modal = new ModalBuilder()
                .setCustomId(`${userid}_nomemodal`)
                .setTitle("🔧 | Alterar Nome do Bot");

                const text = new TextInputBuilder()
                .setCustomId("text")
                .setStyle(1)
                .setLabel("NOVO NOME DO BOT:")
                .setRequired(true);

                modal.addComponents(new ActionRowBuilder().addComponents(text));

                return interaction.showModal(modal);
            }
            if(customId.endsWith("_alteraravatar")){
                resettime();
                const modal = new ModalBuilder()
                .setTitle("🔧 | Alterar Avatar do Bot")
                .setCustomId(`${userid}_alteraravatarmodal`);

                const text = new TextInputBuilder()
                .setCustomId("text")
                .setLabel("LINK DO NOVO AVATAR:")
                .setStyle(1)
                .setRequired(true)

                modal.addComponents(new ActionRowBuilder().addComponents(text));

                return interaction.showModal(modal);
            }

            if(customId.endsWith("_alterarcor")) { 
                resettime();
                const modal = new ModalBuilder()
                .setCustomId(`${userid}_altcor`)
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

            
            if(customId.endsWith("_alterarbanner")){
                resettime();
                const modal = new ModalBuilder()
                .setTitle("🔧 | Alterar Banner Padrão")
                .setCustomId(`${userid}_alterarbannermodal`);

                const text = new TextInputBuilder()
                .setCustomId("text")
                .setLabel("LINK DO NOVO BANNER")
                .setStyle(1)
                .setRequired(true)
                .setPlaceholder("Caso queira remover, digite: \"remover\"");

                modal.addComponents(new ActionRowBuilder().addComponents(text));

                return interaction.showModal(modal);
            }            
            if(customId.endsWith("_alterarminiatura")){
                resettime();
                const modal = new ModalBuilder()
                .setTitle("🔧 | Alterar Miniatura Padrão")
                .setCustomId(`${userid}_alterarminiaturamodal`);

                const text = new TextInputBuilder()
                .setCustomId("text")
                .setLabel("LINK DA NOVA MINIATURA")
                .setStyle(1)
                .setRequired(true)
                .setPlaceholder("Caso queira remover, digite: \"remover\"");

                modal.addComponents(new ActionRowBuilder().addComponents(text));

                return interaction.showModal(modal);
            }

            if(customId.endsWith("_altstatus")) {
                const modal = new ModalBuilder()
            .setTitle("Alterar Status do seu BOT")
            .setCustomId(`${userid}_statusmodal`);

            const text = new TextInputBuilder()
            .setCustomId("presence")
            .setRequired(true)
            .setPlaceholder("Online, Ausente, Invisivel ou Ocupado")
            .setLabel("ESCOLHA O TIPO DE PRESENÇA:")
            .setStyle(1);

            const text1 = new TextInputBuilder()
            .setCustomId("atividade")
            .setRequired(true)
            .setPlaceholder("Jogando, Assistindo, Competindo, Transmitindo, Ouvindo")
            .setLabel("ESCOLHA O TIPO DE ATIVIDADE:")
            .setStyle(1);

            const text2 = new TextInputBuilder()
            .setCustomId("text_ativd")
            .setRequired(true)
            .setPlaceholder("discord.gg/apps")
            .setLabel("ESCREVA O TEXTO DA ATIVIDADE:")
            .setStyle(1);

            const text3 = new TextInputBuilder()
            .setCustomId("url")
            .setRequired(false)
            .setLabel("URL DO CANAL:")
            .setPlaceholder("Se a escolha foi Transmitindo, Coloque a Url aqui, ex: https://www.twitch.tv/discord")
            .setStyle(2);

            modal.addComponents(new ActionRowBuilder().addComponents(text));
            modal.addComponents(new ActionRowBuilder().addComponents(text1));
            modal.addComponents(new ActionRowBuilder().addComponents(text2));
            modal.addComponents(new ActionRowBuilder().addComponents(text3));

            return interaction.showModal(modal);
            }

            if(customId.endsWith("_configchannel")) {
                resettime();
                chun();
            }

            if(customId.endsWith("_configlogs")) {
                resettime();
                chunlogs()
            }

            if(customId.endsWith("_logscarrinho")) {
                const notifycart = await vnd.get(`notifycart`);
                if(notifycart === true) {
                    await vnd.set(`notifycart`, false);
                    await chunlogs();
                }  else{
                    await vnd.set(`notifycart`, true);
                    await chunlogs();
                }
            }

            if(customId.endsWith("_logsaprovved")) {
                const notifyaprovved = await vnd.get(`notifyaprovved`);
                if(notifyaprovved === true) {
                    await vnd.set(`notifyaprovved`, false);
                    await chunlogs();
                }  else{
                    await vnd.set(`notifyaprovved`, true);
                    await chunlogs();
                }
            }

            if(customId.endsWith("_logsstock")) {
                const notifystock = await vnd.get(`notifystock`);
                if(notifystock === true) {
                    await vnd.set(`notifystock`, false);
                    await chunlogs();
                }  else{
                    await vnd.set(`notifystock`, true);
                    await chunlogs();
                }
            }

            if(customId.endsWith("_logspublic")) {
                resettime();
                interaction.update({
                    embeds:[
                        new EmbedBuilder()
                        .setAuthor({name:`${interaction.client.user.username}`, iconURL:interaction.client.user.displayAvatarURL()})
                        .setDescription("Selecione um canal para ser setado como as logs de compras públicas")
                    ],
                    components:[
                        new ActionRowBuilder()
                        .addComponents(
                            new ChannelSelectMenuBuilder()
                            .setChannelTypes(ChannelType.GuildText)
                            .setCustomId(`${userid}_channelpublicselect`)
                            .setPlaceholder("Selecione o Canal de Logs públicas")
                        ),
                        new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                            .setCustomId(`${userid}_removerpublichannel`)
                            .setLabel("Remover Canal")
                            .setEmoji("<:lixo_cloud:1221875710956797992>")
                            .setStyle(4)
                        ), 
                        new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                            .setCustomId(`${userid}_configlogs`)
                            .setLabel("Voltar")
                            .setStyle(2)
                            .setEmoji("⬅")
                        ),
                    ]
                })
            }

            if(customId.endsWith("_logsadm")) {
                resettime();
                interaction.update({
                    embeds:[
                        new EmbedBuilder()
                        .setAuthor({name:`${interaction.client.user.username}`, iconURL:interaction.client.user.displayAvatarURL()})
                        .setDescription("Selecione um canal para ser setado como as logs de compras públicas")
                    ],
                    components:[
                        new ActionRowBuilder()
                        .addComponents(
                            new ChannelSelectMenuBuilder()
                            .setChannelTypes(ChannelType.GuildText)
                            .setCustomId(`${userid}_channeladmselect`)
                            .setPlaceholder("Selecione o Canal de Logs públicas")
                        ),
                        new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                            .setCustomId(`${userid}_removeradmchannel`)
                            .setLabel("Remover Canal")
                            .setEmoji("<:lixo_cloud:1221875710956797992>")
                            .setStyle(4)
                        ), 
                        new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                            .setCustomId(`${userid}_configlogs`)
                            .setLabel("Voltar")
                            .setStyle(2)
                            .setEmoji("⬅")
                        ),
                    ]
                })
            }
            if(customId.endsWith("_removeradmchannel")) {
                resettime();
                await vnd.set(`logs_adm`, "Não Configurado");
                chunlogs();
            }

            if(customId.endsWith("_removerpublichannel")) {
                resettime();
                await vnd.set(`logs_public`, "Não Configurado");
                chunlogs();
            }

            if(customId.endsWith("_categorycart")) {
                resettime();
                interaction.update({
                    embeds:[
                        new EmbedBuilder()
                        .setAuthor({name:`${interaction.client.user.username}`, iconURL:interaction.client.user.displayAvatarURL()})
                        .setDescription(`Selecione uma categoria para criação de carrinhos`)
                    ],
                    components:[
                        new ActionRowBuilder()
                        .addComponents(
                            new ChannelSelectMenuBuilder()
                            .setChannelTypes(ChannelType.GuildCategory)
                            .setCustomId(`${userid}_categoriacarrinhoselect`)
                            .setPlaceholder("Selecione a categoria:")
                        ),
                        new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                            .setCustomId(`${userid}_configchannel`)
                            .setLabel("Voltar")
                            .setStyle(2)
                            .setEmoji("⬅")
                        )
                    ]
                });
            }

            if(customId.endsWith("_rolesclient")) {
                resettime();
                interaction.update({
                    embeds:[
                        new EmbedBuilder()
                        .setAuthor({name:`${interaction.client.user.username}`, iconURL:interaction.client.user.displayAvatarURL()})
                        .setDescription(`Selecione um cargo aqui para ser setado como cargo de cliente.`)
                    ],
                    components:[
                        new ActionRowBuilder()
                        .addComponents(
                            new RoleSelectMenuBuilder()
                            .setCustomId(`${userid}_rolesselect`)
                            .setPlaceholder("Selecione o cargo de cliente:")
                        ),
                        new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                            .setCustomId(`${userid}_configchannel`)
                            .setLabel("Voltar")
                            .setStyle(2)
                            .setEmoji("⬅")
                        )
                    ]
                });
            }
        }
        if(interaction.isRoleSelectMenu()) {
            if(customId.endsWith("_rolesselect")) {
                resettime();
                const role = interaction.values[0];
                try{
                    await interaction.member.roles.add(role).then(async() => {
                        await vnd.set(`roles_client`, role);
                        await chun();
                    }).catch(async (err) => {
                        if(err.message === "Missing Permissions") {
                            await chun();
                            interaction.followUp({content:`❌ | Não é possível setar esse cargo! \nError: O cargo selecionado é superior ao meu!`, ephemeral:true});
                        }
                    })
                } catch {
                    await chun();
                    interaction.followUp({content:`❌ | Não é possível setar esse cargo! \nError: O cargo selecionado é superior ao meu!`, ephemeral:true});
                }

            }
        }
        if(interaction.isChannelSelectMenu()) { 
            if(customId.endsWith("_categoriacarrinhoselect")) {
                resettime();
                const channel = interaction.values[0];
            
            await vnd.set(`category`, channel);

            chun();
            }

            if(customId.endsWith("_channeladmselect")) {
                resettime();
                const channel = interaction.values[0];
            
            await vnd.set(`logs_adm`, channel);

            chunlogs();
            }

            if(customId.endsWith("_channelpublicselect")) {
                resettime();
                const channel = interaction.values[0];
            
            await vnd.set(`logs_public`, channel);

            chunlogs();
            }
        }
        if(interaction.isModalSubmit()) { 
            if(customId.endsWith("_termsmodal")) {
                const text = interaction.fields.getTextInputValue("text");
                await vnd.set("terms", text);
                await interaction.reply({
                    content:`${interaction.user}`,
                    embeds:[
                        new EmbedBuilder()
                        .setDescription(`> ✅ | Termos Alterados com sucesso! \n\n ${text}`)
                    ],
                    ephemeral:true,
                });
            }
            if(customId.endsWith("_statusmodal")) {
                const text = interaction.fields.getTextInputValue("presence");
        const text1 = interaction.fields.getTextInputValue("atividade");
        const text2 = interaction.fields.getTextInputValue("text_ativd");
        const url = interaction.fields.getTextInputValue("url") || "https://www.twitch.tv/discord";
    
        const statusMap = {
          "online": "online",
          "ausente": "idle",
          "ocupado": "dnd",
          "invisivel": "invisible",
        };
    
        const activityMap = {
          "jogando": "Playing",
          "assistindo": "Watching",
          "competindo": "Competing",
          "transmitindo": "Streaming",
          "ouvindo": "Listening"
        };
        if(Object.keys(statusMap).includes(text.toLowerCase()) && Object.keys(activityMap).includes(text1.toLowerCase())) {
          
          if(text1.toLowerCase() === "transmitindo") {
            try{
              interaction.client.user.setPresence({
                activities: [{
                    name: `${text2}`,
                    type: ActivityType[activityMap[text1.toLowerCase()]],
                    url: url
                }]
            })
        
            interaction.client.user.setStatus(statusMap[text.toLowerCase()]);
            botp()
        } catch(err){
            interaction.reply({
              content:"Ocorreu um erro ao tentar mudar os status do bot",
              ephemeral:true
            })
          }
          } else {
            try{
              
              interaction.client.user.setPresence({
                activities: [{
                    name: `${text2}`,
                    type: ActivityType[activityMap[text1.toLowerCase()]],
                }]
            })
        
            interaction.client.user.setStatus(statusMap[text.toLowerCase()]);
            botp()
            } catch(err){
              interaction.reply({
                content:"Ocorreu um erro ao tentar mudar os status do bot",
                ephemeral:true
              })
            }
          }
        } else {
          interaction.reply({content:"Desculpe, mas a atividade fornecida não é válida. Por favor, forneça uma das seguintes atividades: jogando, assistindo, competindo, transmitindo, ouvindo.", ephemeral:true});
        }


            }
            if(customId.endsWith("_alterarminiaturamodal")) {
                resettime();
                const text = interaction.fields.getTextInputValue("text");
                if(text === "remover") {
                    await bot.set(`miniatura`, "Não Configurado");
                    interaction.reply({
                        content:`✅ | Miniatura removido!`,
                        ephemeral:true,
                    });
                    await botmsg();

                    return;
                }
                try {
                    interaction.reply({
                        content:`${interaction.user}`,
                        embeds:[
                            new EmbedBuilder()
                            .setDescription("✅ | Miniatura alterado")
                            .setImage(text)
                        ],
                        ephemeral:true
                    }).then(async() => {
                        await bot.set(`miniatura`, text);
                        botmsg();
                    }).catch(() => {
                        interaction.reply({content:`⚠️ | Miniatura inválido!`, ephemeral:true})
                    })
                } catch{ 
                    interaction.reply({content:`⚠️ | Miniatura inválido!`, ephemeral:true})
                }

            }
            if(customId.endsWith("_alterarbannermodal")) {
                resettime();
                const text = interaction.fields.getTextInputValue("text");
                if(text === "remover") {
                    await bot.set(`banner`, "Não Configurado");
                    interaction.reply({
                        content:`✅ | Banner removido!`,
                        ephemeral:true,
                    });
                    await botmsg();

                    return;
                }
                try {
                    interaction.reply({
                        content:`${interaction.user}`,
                        embeds:[
                            new EmbedBuilder()
                            .setDescription("✅ | Banner alterado")
                            .setImage(text)
                        ],
                        ephemeral:true
                    }).then(async() => {
                        await bot.set(`banner`, text);
                        botmsg()
                    }).catch(() => {
                        interaction.reply({content:`⚠️ | Banner inválido!`, ephemeral:true})
                    })
                } catch{ 
                    interaction.reply({content:`⚠️ | Banner inválido!`, ephemeral:true})
                }

            }
            if(customId.endsWith("_altcor")) {
                resettime();
                const text = interaction.fields.getTextInputValue("text");
                await interaction.reply({content:`🔁 | Aguarde um Momento...`, ephemeral:true});

                try { 
                    interaction.editReply({
                        content:`${interaction.user}`,
                        embeds:[
                            new EmbedBuilder()
                            .setColor(text)
                            .setDescription(`✅ | Cor do bot editado com **sucesso.** Nova cor \`${text}\``)
                        ]
                    }).then(async () => {
                        await bot.set(`cor`, text);
                    }).catch(() => {
                        
                    interaction.editReply({
                        content:`❌ | Cor inválida, para pegar uma cor hex [Clique Aqui](https://g.co/kgs/KbZVXP)`
                    });
                    })
                } catch {
                    interaction.editReply({
                        content:`❌ | Cor inválida, para pegar uma cor hex [Clique Aqui](https://g.co/kgs/KbZVXP)`
                    });
                }

                botmsg();

            }
            if(customId.endsWith("_alteraravatarmodal")) {
                resettime();
                const text = interaction.fields.getTextInputValue("text");
                await interaction.reply({content:`🔁 | Aguarde um Momento...`, ephemeral:true});
                try {
                    interaction.editReply({
                        content:`${interaction.user}`,
                        embeds:[
                            new EmbedBuilder()
                            .setDescription(`✅ | Seu Novo Avatar`)
                            .setImage(text)
                        ]
                    }).then(() => {
                        try {
                            interaction.client.user.setAvatar(text).catch(() => {
                                interaction.editReply({
                                    content:`⚠️ | Avatar inválido!`,
                                    embeds:[],
                                    components:[]
                                });
                            })
                        } catch{
                            interaction.editReply({
                                content:`⚠️ | Avatar inválido!`,
                                embeds:[],
                                components:[]
                            });
                        }

                    })
                } catch {
                    interaction.editReply({
                        content:`⚠️ | Avatar inválido!`
                    })
                }

            }
            if(customId.endsWith("_nomemodal")) {
                resettime();
                const text = String(interaction.fields.getTextInputValue("text"));
                await interaction.reply({content:`🔁 | Alterando nome...`, ephemeral:true});
                try {
                   await client.user.setUsername(text).then(() => {
                    interaction.editReply({content:`✅ | Nome Alterado com sucesso`})
                   }).catch((err) => {
                    interaction.editReply({
                        content:`⚠️ | Aconteceu algum erro!\n${err.message}`
                    });
                   });
                }catch (err){
                    interaction.editReply({
                        content:`⚠️ | Aconteceu algum erro!\n${err.message}`
                    });
                }
                
                botmsg();

            }
            if(customId.endsWith("_qrcodemodal")) {
                resettime();
                const text = interaction.fields.getTextInputValue("text");
                if(text === "remover") {
                    await vnd.set(`qrcode`, "Não Configurado");
                    await semiauto();
                    interaction.followUp({
                        content:`✅ | Qr Code removido!`,
                        ephemeral:true,
                    });

                    return;
                }
                try {
                    interaction.reply({
                        content:`${interaction.user}`,
                        embeds:[
                            new EmbedBuilder()
                            .setDescription("✅ | Qr Code alterado")
                            .setImage(text)
                        ],
                        ephemeral:true
                    }).then(async() => {
                        await vnd.set(`qrcode`, text);
                        let image = await vnd.get("qrcode");
                        if(image.startsWith("https://")) {
                            image = `[Qr Code](${await vnd.get("qrcode")})`;
                        }
            
                        const chave = await vnd.get("chavepix");
                        const tipochave = await vnd.get("tipochave");
                        let chs = "";
                        if(chave === "Não Configurado" && tipochave === "Não Configurado") {
                            chs = 'Não Configurado'
                        } else {
                            chs = `\`${tipochave}\` - ${chave}`
                        }
            
                        await interaction.message.edit({
                            
                    embeds:[
                        new EmbedBuilder()
                        .setThumbnail(interaction.client.user.displayAvatarURL())
                        .setAuthor({name:`${interaction.client.user.username}`, iconURL:interaction.client.user.displayAvatarURL()})
                        .setTitle(`🛠️ | Sistema de Pagamento Semi Automático.`)
                        .setDescription(`⚙️ | Sistema: ${await vnd.get("semiauto") === true ? "ON" : "OFF"}\n🔗 | Chave Pix: ${chs}\n📋 | Qr Code: ${image}`)
                        .setColor("Random")
                    ],
                    components:[
                        new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                            .setCustomId(`${interaction.user.id}_semiautoonoff`)
                            .setLabel("Semiauto ON/OFF")
                            .setStyle(await vnd.get("semiauto") === true ? 3 : 4)
                            .setEmoji("<:engrenagem_cloud:1213652588571004959>"),
                            new ButtonBuilder()
                            .setCustomId(`${interaction.user.id}_chavepix`)
                            .setLabel("Chave Pix")
                            .setEmoji("<:Pix:1221876826402586835>")
                            .setStyle(2),
                            new ButtonBuilder()
                            .setCustomId(`${interaction.user.id}_qrcode`)
                            .setLabel("Qr Code")
                            .setEmoji("<:qrcode_cloud:1221878642267652139>")
                            .setStyle(2),
                            new ButtonBuilder()
                            .setCustomId(`${interaction.user.id}_configpag`)
                            .setLabel("Voltar")
                            .setStyle(2)
                            .setEmoji("⬅"),
                        )
                    ]
                        });
                    }).catch(() => {
                        interaction.reply({content:`⚠️ | Qr Code inválido!`, ephemeral:true})
                    })
                } catch{ 
                    interaction.reply({content:`⚠️ | Qr Code inválido!`, ephemeral:true})
                }

            }
            if(customId.endsWith("_chavepixmodal")) {
                resettime();
                const tipo = interaction.fields.getTextInputValue("text");
                const chave = interaction.fields.getTextInputValue("text1");

                await vnd.set(`tipochave`, tipo);
                await vnd.set(`chavepix`, chave);
                await semiauto();
                await interaction.followUp({
                    content:`✅ | Tipo de Chave: ${tipo}\n✅ | Chave: ${chave}`,
                    ephemeral:true
                });
            }
            if(customId.endsWith("_depmodal")) {
                resettime()
                const porcentagem = parseInt(interaction.fields.getTextInputValue("text"));
                const valormin = parseInt(interaction.fields.getTextInputValue("text"));
                if(isNaN(porcentagem)) return interaction.reply({content:`⚠️ | Porcentagem inválida!`, ephemeral:true});
                if(Number(porcentagem) < 1) return interaction.reply({content:`⚠️ | Coloque uma porcentagem acima de 0`, ephemeral:true});
                if(Number(porcentagem) > 100) return interaction.reply({content:`⚠️ | Coloque uma porcentagem abaixo de 100`, ephemeral:true});

                
                if(isNaN(valormin)) return interaction.reply({content:`⚠️ | Valor inválido!`, ephemeral:true});
                if(Number(valormin) < 1) return interaction.reply({content:`⚠️ | Coloque um valor acima de 0`, ephemeral:true});
                if(Number(valormin) > 1000) return interaction.reply({content:`⚠️ | Coloque um valor abaixo de 1000`, ephemeral:true});

                await vnd.set(`saldobonus`, Number(porcentagem));
                await vnd.set(`saldomin`, Number(valormin));
                await saldo();
                await interaction.followUp({
                    content:`✅ | Bônus por depósito: ${porcentagem}%\n✅ | Valor mínimo de depósito: R$${valormin}`,
                    ephemeral:true
                })

                
            }
            if(customId.endsWith("_tempa_modal")) {
                resettime();
                const text = parseInt(interaction.fields.getTextInputValue("text"));

                if(isNaN(text)) return interaction.reply({content:`Coloque um Numero Valido`, ephemeral:true});
                if(Number(text) < 5) return interaction.reply({content:`Coloque um Valor Acima de 5`, ephemeral:true});
                if(Number(text) > 20) return interaction.reply({content:`Coloque um Valor Abaixo de 20`, ephemeral:true});

                await vnd.set(`tempmax`, Number(text));
                await mp();
                await interaction.followUp({
                    content:`✅ | Tempo Máximo Para Pagar: ${text} minutos.`,
                    ephemeral:true
                })
            } 
            
            if(customId.endsWith("_acesstoken_modal")) {
                resettime();
                const text = interaction.fields.getTextInputValue("text");
                await interaction.reply({
                    content:`🔁 | Verificando...`,
                    ephemeral:true
                });
                const url = `https://api.mercadopago.com/users/me`;

    try {
        const response = await axios.get(url, {
            headers: {
              'Authorization': `Bearer ${text}`
            }
          })
          ;
        if (response.status === 200) {
            await vnd.set(`acess_token`, text);
            
            await interaction.message.edit({
                embeds:[
                    new EmbedBuilder()
                    .setThumbnail(interaction.client.user.displayAvatarURL())
                    .setAuthor({name:`${interaction.client.user.username}`, iconURL:interaction.client.user.displayAvatarURL()})
                    .setTitle(`🤝 | Configurar Mercado Pago`)
                    .setColor("Random")
                    .setDescription(`🔗 | Pix: ${vnd.get(`pix`) === true ? "ON" : "OFF"}\n🤝 | Pagar pelo Site: ${vnd.get(`pagarsite`) === true ? "ON" : "OFF"}\n🕗 | Tempo Máximo para pagar: ${vnd.get(`tempmax`)} minutos\n⚙️ | Access Token: || ${vnd.get(`acess_token`)} ||`)
                ],
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_pixonoff`)
                        .setLabel("Pix ON/OFF")
                        .setEmoji("<:engrenagem_cloud:1213652588571004959>")
                        .setStyle(vnd.get(`pix`) === true ? 3 : 4),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_siteonoff`)
                        .setLabel("Site ON/OFF")
                        .setEmoji("<:engrenagem_cloud:1213652588571004959>")
                        .setStyle(vnd.get(`pagarsite`) === true ? 3 : 4),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_temppagar`)
                        .setLabel("Tempo para Pagar")
                        .setEmoji("<:relogio_cloud:1221880072265269409>")
                        .setStyle(2),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_altacesstoken`)
                        .setLabel("Alterar Acess Token")
                        .setEmoji("<:MercadoPago:1221877449340752002>")
                        .setStyle(2),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_configpag`)
                        .setLabel("Voltar")
                        .setEmoji("⬅")
                        .setStyle(2),
                    )
                ]
            });
            await interaction.editReply({
                content:`✅ | Access Token Alterado com sucesso!`
            })
        }
    } catch (error) {
        if (error.response && error.response.status === 400) {
            await interaction.editReply({
                content:`⚠️ | Access Token inválido!\nMercadoPagoError: Must provide your access_token to proceed\n\n> Tutorial para pegar o Access Token: [CliqueAqui](https://youtu.be/w7kyGZUrkVY)\n> Lembre-se de cadastrar uma chave pix na sua conta mercado pago!`
            })
        } else {
            await interaction.editReply({
                content:`⚠️ | Ocorreu um um erro ao tentar consultar o seu Acess_Token\nMensagem do Erro: ${error.message}`
            })
        }
    }


                
            }
        }
        if(customId.endsWith("_blockbank")) {
            interaction.update({
                embeds:[],
                content:"",
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                        .setCustomId(`${userid}_blockbankselect`)
                        .setPlaceholder("Selecione os bancos que deseja bloquear")
                        .setMinValues(1)
                        .setMaxValues(6)
                        .addOptions(
                            {
                                label:"Banco Inter S.A.",
                                emoji:"🇧🇷",
                                value:`Banco Inter S.A.`
                            },
                            {
                                label:"Picpay Serviços S.A.",
                                emoji:"🇧🇷",
                                value:`Picpay Serviços S.A.`
                            },
                            {
                                label:"Banco Bradesco S.A.",
                                emoji:"🇧🇷",
                                value:`Banco Bradesco S.A.`
                            },
                            {
                                label:"Nu Pagamentos S.A.",
                                emoji:"🇧🇷",
                                value:`Nu Pagamentos S.A.`
                            },
                            {
                                label:"Banco do Brasil S.A.",
                                emoji:"🇧🇷",
                                value:`Banco do Brasil S.A.`
                            },
                            {
                                label:"Banco Itaucard S.A.",
                                emoji:"🇧🇷",
                                value:`Banco Itaucard S.A.`
                            },
                        )
                    ),
                    new ActionRowBuilder()
                    .addComponents(//_mpconfig
                    new ButtonBuilder()
                    .setCustomId(`${userid}_desblockbank`)
                    .setLabel("Desbloquear Todos")
                    .setEmoji("<:lixo_cloud:1221875710956797992>")
                    .setStyle(2),
                    new ButtonBuilder()
                    .setCustomId(`${userid}_mpconfig`)
                    .setLabel("Voltar")
                    .setEmoji("⬅")
                    .setStyle(2),
                    
                    )
                ]
            })
        }
        if(customId.endsWith("_blockbankselect")) {
            await bot.set(`banks`, interaction.values);
            mp();
        }
        if(customId.endsWith("_desblockbank")) {
            await bot.set(`banks`, []);
            mp();
        }
        if(customId.endsWith("_channelfdb")) {
            resettime();
            interaction.update({
                embeds:[
                    new EmbedBuilder()
                    .setAuthor({name:`${interaction.client.user.username}`, iconURL:interaction.client.user.displayAvatarURL()})
                    .setDescription("Selecione um canal para ser setado como o Canal de FeedBack")
                ],
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new ChannelSelectMenuBuilder()
                        .setChannelTypes(ChannelType.GuildText)
                        .setCustomId(`${userid}_chnfeedback`)
                        .setPlaceholder("Selecione o Canal de FeedBack")
                    ),
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_removerfddchannel`)
                        .setLabel("Remover Canal")
                        .setEmoji("<:lixo_cloud:1221875710956797992>")
                        .setStyle(4)
                    ), 
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_configlogs`)
                        .setLabel("Voltar")
                        .setStyle(2)
                        .setEmoji("⬅")
                    ),
                ]
            })
        }
        if(customId.endsWith("_chnfeedback")) {
            resettime();
            await vnd.set(`channel_fedback`, interaction.values[0]);
            chunlogs();
        }
        if(customId.endsWith("_removerfddchannel")) {
            resettime();
            await vnd.set(`channel_fedback`, "Não Configurado");
            chunlogs();
        }

        

        if(customId.endsWith("_acesstokenmudar")) {
            resettime();
            interaction.update({
                content:"",
                embeds:[
                    new EmbedBuilder()
                    .setTitle(`${emoji(25)} | Alterar Acess Token`)
                    .setDescription("Se a sua conta no Mercado Pago for de um menor de idade, opte pela segunda opção.")
                    .setColor("Random")
                    .setThumbnail(interaction.client.user.displayAvatarURL())
                    .setAuthor({name:`${interaction.client.user.username}`, iconURL: interaction.client.user.displayAvatarURL()})
                ],
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_altacesstoken`)
                        .setLabel("Setar Acess Token")
                        .setEmoji("<:engrenagem_cloud:1213652588571004959>") 
                        .setStyle(1),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_autenticarmercadopago`)
                        .setLabel("Autenticar MercadoPago [-18]")
                        .setEmoji("<:link:1213332587343253556>")
                        .setStyle(2),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_mpconfig`)
                        .setLabel("Voltar")
                        .setEmoji("⬅") // SHAWK
                        .setStyle(2)
                    )
                ]
            })
        }
        if(customId.endsWith("_autenticarmercadopago")) {
            if (timer[interaction.message.id]) {
                clearTimeout(timer[interaction.message.id]);
            }
            
            const min = moment().add(15, 'minutes');
            await interaction.update({
                content:`Autorizar seu **Mercado Pago** á **NYX Community**\n\n**Status:** Aguardando autorizar.\nEssa mensagem vai expirar em <t:${Math.floor(min / 1000)}:R>\n(Para autorizar, clique no botão abaixo, selecione 'Brasil' e clique em Continuar/Confirmar/Autorizar)`,
                embeds:[],
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setLabel("Autorizar Mercado Pago")
                        .setStyle(5)
                        .setURL(`https://nyxcommunity.squareweb.app/mp/${interaction.guild.id}/vendasv1`),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_acesstokenmudar`)
                        .setStyle(1)
                        .setEmoji("⬅")
                    )
                ]
            });
            const check = setInterval(async() => {
                try {
                    const response = await axios.get(`https://nyxcommunity.squareweb.app/mp/${interaction.guild.id}/api`);
                    const data = response.data;
                    if(data.acesstoken) {
                        clearInterval(check);
                        if (timer[interaction.message.id]) {
                            clearTimeout(timer[interaction.message.id]);
                        }
                        await vnd.set("acess_token", data.acesstoken);
                        interaction.editReply({
                            content:`**Status:** ✅ Autorização bem sucedida!`,
                            components:[
                                new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                    .setCustomId(`${userid}_acesstokenmudar`)
                                    .setStyle(1)
                                    .setEmoji("⬅")
                                )
                            ]
                        });
                    }
                } catch(err) {
                }
            }, 1000);
            timer[interaction.message.id] = setTimeout(() => {
                clearInterval(check);
                if(interaction.message) {
                    interaction.message.edit({
                        content:"⚠️ | Você não se cadastro durante 5 Minutos, cadastre-se novamente!",
                        components:[
                            new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                .setCustomId(`${userid}_acesstokenmudar`)
                                .setStyle(1)
                                .setEmoji("⬅")
                            )
                        ],
                        embeds:[],
                        files:[]
                    }); 
                }
            }, 15 * 60 * 1000);
        }
        if(customId.endsWith("_buttonconfigduvida")) {
            resettime();
            duvida();
        }
        if(customId.endsWith("_ativoffduvidas")) {
            resettime();
            const duv = await bot.get("duvidas");
            const status = !duv.status ? "`Ativado`" : "`Desativado`";
            await bot.set("duvidas.status", !duv.status);
            await duvida();
            interaction.followUp({
                embeds:[
                    new EmbedBuilder()
                    .setColor("Random")
                    .setDescription(`O Botão de Duvidas foi ${status}.`)
                ],
                ephemeral:true
            });
        }
        if(customId.endsWith("_textobuttonduvida")) {
            resettime();
            const modal = new ModalBuilder()
            .setCustomId(`${userid}_duvidlabelmodal`)
            .setTitle("💡 - Alterar Texto do Botão");

            const text = new TextInputBuilder()
            .setCustomId("text")
            .setLabel("Novo nome do botão")
            .setPlaceholder("Dê um texto para o botão.")
            .setStyle(1)
            .setMaxLength(20)
            .setRequired(true);

            modal.addComponents(new ActionRowBuilder().addComponents(text));

            return interaction.showModal(modal);
        }
        if(customId.endsWith("_duvidlabelmodal")) {
            resettime();
            const text = interaction.fields.getTextInputValue("text");
            await bot.set("duvidas.label", text);
            await duvida();
            interaction.followUp({
                embeds:[
                    new EmbedBuilder()
                    .setColor(`Random`)
                    .setDescription(`O Texto do Botão de Duvidas foi alterado Para \`${text}\`.`)
                ],
                ephemeral:true
            });
        }
        if(customId.endsWith("_canalredicduvidas")) {
            resettime();
            interaction.update({
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new ChannelSelectMenuBuilder()
                        .setCustomId(`${userid}_selectchannelduvidas`)
                        .setChannelTypes(ChannelType.GuildText)
                        .setMaxValues(1)
                        .setPlaceholder("Selecione abaixo o Canal.")
                    ),
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_buttonconfigduvida`)
                        .setLabel("Voltar")
                        .setStyle(2)
                        .setEmoji("⬅")
                    )
                ]
            });
        }
        if(customId.endsWith("_selectchannelduvidas")) {
            resettime();
            const id = interaction.values[0];
            await bot.set("duvidas.channel", id);
            await duvida();
            interaction.followUp({
                embeds:[
                    new EmbedBuilder()
                    .setColor("Random")
                    .setDescription(`O Canal de Redirecionamento do Botão de Duvidas foi alterado para: <#${id}>`)
                ],
                ephemeral:true
            });
        }
        if(customId.endsWith("_emojibuttonduvida")) {
            resettime();
            interaction.update({
                embeds: [
                  new EmbedBuilder().setColor("Random")
                    .setTitle(`${interaction.client.user.username} | Emoji do Botão`)
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

      function emojiverification2(str) {
        const emojiPattern = emojiRegex();
        const emojis = str.match(emojiPattern) || [];
          
        return emojis.length === 1;
    }

        if (!emojiverification && !emojiverification2(emojis)) {
           await interaction.followUp({
              ephemeral:true,
               content:`❌ | Coloque um emoji Valido!`
              })
              await duvidaedit();
            return;
        }  
        await bot.set(`duvidas.emoji`, emojis);
        await duvidaedit();
  
});


const filterBotao = (i) => i.customId.startsWith(userid) && i.customId.endsWith("_cancelled") && i.user.id === interaction.user.id;
const collectorBotao = interaction.channel.createMessageComponentCollector({ filter: filterBotao});


collectorBotao.on("collect", (i) => {
  collectorMensagem.stop();
  collectorBotao.stop("cancelled");
  i.deferUpdate();
  duvidaedit();
});
        }
        if(customId.endsWith("_configmod123")) {
            resettime();
            interaction.update({
                embeds:[
                    new EmbedBuilder()
                    .setAuthor({name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL()})
                    .setThumbnail(interaction.client.user.displayAvatarURL())
                    .setColor("Random")
                    .setFooter({text:`${interaction.guild.name}`, iconURL: interaction.guild.iconURL()})
                    .setTimestamp()
                    .setTitle(`⚙️ | Painel de Configuração Moderação`)
                    .setDescription("Selecione o Sistema que Deseja configurar:")
                ],
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_autoroleconfig`)
                        .setLabel("Configurar Auto Role")
                        .setEmoji("<:users_cloud:1213635311905669203>")
                        .setStyle(1),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_mensagemautoconfig`)
                        .setLabel("Mensagem Automática")
                        .setEmoji("<:msg_cloud:1213638489120182342>")
                        .setStyle(1),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_configboasvindas`)
                        .setLabel("Configurar Boas Vindas")
                        .setEmoji("<a:welcome_cloud:1213638647077675049>")
                        .setStyle(1)
                    ),
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_configsystemfake`)
                        .setLabel("Configurar Sistema Anti-Fake")
                        .setEmoji("<:marteloban_cloud:1213638770927345744>")
                        .setStyle(1),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_voltar`)
                        .setLabel("Voltar")
                        .setStyle(2)
                        .setEmoji("⬅")
                    )
                ]
            });
        }

        if(customId.endsWith("_autoroleconfig")) {
            resettime();
            autorole();
        }
        if(customId.endsWith("_addcargoentrar")) {
            resettime();
            interaction.update({
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new RoleSelectMenuBuilder()
                        .setCustomId(`${userid}_selectautorole`)
                        .setMaxValues(7)
                        .setPlaceholder("Selecione abaixo qual será o CARGO vai dar AUTOMATICAMENTE")
                    ),
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_autoroleconfig`)
                        .setLabel("Voltar")
                        .setStyle(2)
                        .setEmoji("⬅")
                    )
                ]
            })
        }
        if(customId.endsWith("_selectautorole")) {
            resettime();
            await bot.set("automod.autorole", interaction.values);
            await autorole();
            interaction.followUp({
                content:`O sistema de AutoRole foi configurado com sucesso`,
                ephemeral:true
            });
        }
        if(customId.endsWith("_resetautoroles")) {
            await bot.set("automod.autorole", []);
            await autorole();
            interaction.followUp({
                content:`O sistema de AutoRole foi resetado com sucesso`,
                ephemeral:true
            });
        }
        if(customId.endsWith("_mensagemautoconfig")) {
            resettime();
            mensagemauto();
        }
        if(customId.endsWith("_onoffmsgauto")) {
            const mensagem = await bot.get("automod.mensagem_auto");
            const status = !mensagem.system ? "`Ativada`" : "`Desativada`";
            await bot.set("automod.mensagem_auto.system", !mensagem.system);
            await mensagemauto();
            interaction.followUp({
                embeds:[
                    new EmbedBuilder()
                    .setColor("Random")
                    .setDescription(`O Sistema de Mensagens automaticas foi ${status}.`)
                ],
                ephemeral:true
            });
        }
        if(customId.endsWith("_criarmsgauto")) {
            resettime();
            const modal = new ModalBuilder()
            .setTitle("Configurar Embed")
            .setCustomId(`${userid}_criarmsgautomodal`);

            const title = new TextInputBuilder()
            .setCustomId("title")
            .setLabel("envie abaixo o titulo da embed")
            .setMaxLength(200)
            .setRequired(false)
            .setStyle(1)
            .setPlaceholder("Titulo Título da Embed");

            const desc = new TextInputBuilder()
            .setCustomId("desc")
            .setLabel("envie abaixo a mensagem")
            .setStyle(2)
            .setMaxLength(4000)
            .setRequired(true)
            .setPlaceholder("Descrição da Embed");

            const banner = new TextInputBuilder()
            .setCustomId("banner")
            .setLabel("envie o banner")
            .setStyle(1)
            .setRequired(false)
            .setPlaceholder("Banner da Embed");

            const channel = new TextInputBuilder()
            .setCustomId("channel")
            .setStyle(1)
            .setLabel("envie o id do canal que será enviado")
            .setPlaceholder("Canal que será enviado a mensagem")
            .setRequired(true);

            const time = new TextInputBuilder()
            .setCustomId("time")
            .setLabel("Quanto tempo? (em segundos)")
            .setMaxLength(3)
            .setPlaceholder("Quanto tempo será enviado a mensagem?")
            .setStyle(1)
            .setRequired(true);

            modal.addComponents(new ActionRowBuilder().addComponents(title));
            modal.addComponents(new ActionRowBuilder().addComponents(desc));
            modal.addComponents(new ActionRowBuilder().addComponents(banner));
            modal.addComponents(new ActionRowBuilder().addComponents(channel));
            modal.addComponents(new ActionRowBuilder().addComponents(time));

            return interaction.showModal(modal);
        }
        if(customId.endsWith("_criarmsgautomodal")) {
            resettime();
            const title = interaction.fields.getTextInputValue("title") || null;
            const desc = interaction.fields.getTextInputValue("desc");
            const banner = interaction.fields.getTextInputValue("banner") || null;
            const channel = interaction.fields.getTextInputValue("channel");
            const time = parseInt(interaction.fields.getTextInputValue("time"));
            const chnchk = interaction.guild.channels.cache.get(channel);
            if(!chnchk) return interaction.reply({content:`${emoji(2)} | Não existe um canal com ID dê \`${channel}\``, ephemeral:true});
            if(isNaN(time)) return interaction.reply({content:`${emoji(2)} | Coloque apenas numeros na quantidade de Segundos`, ephemeral:true});
            if(time < 1) return interaction.reply({content:`${emoji(12)} | Coloque acima de \`1 Segundo\``, ephemeral:true});
            await interaction.deferUpdate();
            try {
                await interaction.followUp({
                    content:`${interaction.user}`,
                    embeds:[
                        new EmbedBuilder()
                        .setAuthor({name: "Previa da Embed"})
                        .setTitle(title)
                        .setDescription(desc)
                        .setColor(await bot.get("cor"))
                        .setImage(banner)
                    ],
                    components:[
                        new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                            .setCustomId("oasidnmasiod123asniud")
                            .setLabel("Mensagem Automatica")
                            .setStyle(2)
                            .setDisabled(true)
                        )
                    ],
                    ephemeral:true
                }).then(async() => {
                    await bot.push("automod.mensagem_auto.mensagem", {
                        title,
                        desc,
                        banner,
                        channel,
                        tempo: Number(time),
                        ind: Number(await bot.get("automod.mensagem_auto.mensagem").length + 1)
                    });
                    mensagemautoedit();
                })
            } catch(err) {
                interaction.followUp({
                    content:`${emoji(29)} | Ocorreu um erro...\n\n**Mensagem do erro:** \`\`\`${err.message}\`\`\``,
                    ephemeral:true
                })
            }
        }
        if(customId.endsWith("_removermsgauto")) {
            resettime();
            const modal = new ModalBuilder()
            .setCustomId(`${userid}_deletemsgautomodal`)
            .setTitle("Configurar Mensagem Automatica");

            const text = new TextInputBuilder()
            .setCustomId("text")
            .setStyle(1)
            .setMaxLength(3)
            .setRequired(true)
            .setPlaceholder("Envie apenas numeros.")
            .setLabel("qual mensagem deseja retirar?");

            modal.addComponents(new ActionRowBuilder().addComponents(text));

            return interaction.showModal(modal);
        }
        if(customId.endsWith("_deletemsgautomodal")) {
            const text = parseInt(interaction.fields.getTextInputValue("text"));
            const valor = text - 1;
            if(isNaN(text)) return interaction.reply({content:`${emoji(2)} | Coloque apenas numeros.`, ephemeral:true});
            if(text <= 0) return interaction.reply({content:`${emoji(2)} | Coloque um Valor Acima de \`0\`.`, ephemeral:true});
            if(valor > await bot.get("automod.mensagem_auto.mensagem").length) return interaction.reply({content:`${emoji(2)} | Coloque um Valor Abaixo dê \`${await bot.get("automod.mensagem_auto.mensagem").length}\`.`, ephemeral:true});
            const a = await bot.get("automod.mensagem_auto.mensagem");
            await a.splice(Number(valor), 1)[0]; 
            await bot.set("automod.mensagem_auto.mensagem", a);
            mensagemauto();
        }
        if(customId.endsWith("_configboasvindas")) {
            resettime();
            const modal = new ModalBuilder()
            .setCustomId(`${userid}_boasvindasmodal`)
            .setTitle("Editar Boas Vindas");

            const msg = new TextInputBuilder()
            .setCustomId("msg")
            .setStyle(1)
            .setRequired(true)
            .setMaxLength(1000)
            .setLabel("Mensagem:")
            .setPlaceholder("Insira aqui sua mensagem, use {member} para mencionar o membro e {guildname} para o servidor.");

            const tempo = new TextInputBuilder()
            .setCustomId("tempo")
            .setLabel("tempo para apagar a mensagem:")
            .setStyle(1)
            .setMaxLength(3)
            .setPlaceholder("Insira aqui a quantidade em segundos.")
            .setRequired(true);

            const channels = new TextInputBuilder()
            .setCustomId("channels")
            .setLabel("qual canal vai ser enviado?")
            .setStyle(1)
            .setRequired(true)
            .setPlaceholder("Insira aqui o ID do canal que vai enviar. (ID, ID, ID)");

            modal.addComponents(new ActionRowBuilder().addComponents(msg));
            modal.addComponents(new ActionRowBuilder().addComponents(tempo));
            modal.addComponents(new ActionRowBuilder().addComponents(channels));

            return interaction.showModal(modal);
        }
        if(customId.endsWith("_boasvindasmodal")) {
            const msg = interaction.fields.getTextInputValue("msg");
            const tempo = parseInt(interaction.fields.getTextInputValue("tempo"));
            const channels = interaction.fields.getTextInputValue("channels").split(", ");
            if(isNaN(tempo)) return interaction.reply({content:`${emoji(2)} | Coloque um Tempo Valido!`, ephemeral:true});
            if(tempo < 1) return interaction.reply({content:`${emoji(2)} | Coloque um Tempo Acima de 1.`, ephemeral:true});
            await bot.set("automod.boasvindas", {
                message: msg,
                tempoaapgar: Number(tempo),
                canais: channels
            });
            interaction.reply({content:`${emoji(11)} | Todas configurações de Bem vindo foram configuradas com sucesso!`, ephemeral:true});
        }
        if(customId.endsWith("_configsystemfake")) {
            resettime();
            const modal = new ModalBuilder()
            .setCustomId(`${userid}_antifakemodal`)
            .setTitle("Configurar Ant-Fake");

            const dias = new TextInputBuilder()
            .setCustomId("dias")
            .setLabel("quantidade de dias mínima para entrar")
            .setStyle(1)
            .setRequired(true)
            .setPlaceholder('Digite "não" para desativar, serve para todos os campos.');

            const status = new TextInputBuilder()
            .setCustomId("stats")
            .setLabel("lista de status que deseja bloquear")
            .setPlaceholder("Digite separado por vírgulas os status das contas que deseja punir se detectadas.\nStatus1, Status2")
            .setRequired(true)
            .setStyle(2);

            const names = new TextInputBuilder()
            .setCustomId("names")
            .setStyle(2)
            .setLabel("lista de nomes que deseja bloquear")
            .setRequired(true)
            .setPlaceholder("Digite separado por virgulas os nomes das contas que deseja punir se detectadas.\nNome1, Nome2");

            modal.addComponents(new ActionRowBuilder().addComponents(dias));
            modal.addComponents(new ActionRowBuilder().addComponents(status));
            modal.addComponents(new ActionRowBuilder().addComponents(names));

            return interaction.showModal(modal);
        }
        if(customId.endsWith("_antifakemodal")) {
            const dias = interaction.fields.getTextInputValue("dias");
            const status = interaction.fields.getTextInputValue("stats");
            const names = interaction.fields.getTextInputValue("names");
            if(isNaN(dias) && dias !== "não") return interaction.reply({content:`${emoji(2)} | Coloque apenas numeros!`, ephemeral:true});
            await bot.set("automod.antifake", {
                "dias":dias === "não" ? null : Number(dias).toFixed(2),
                "status":status === "não" ? [] : status.split(", "),
                "nomes":names === "não" ? [] : names.split(", ")
            });
            interaction.reply({content:`${emoji(11)} | Todas configurações de Anti-Fake foram configuradas com sucesso!`, ephemeral:true});
        }
        async function mensagemauto() {
            const mensagem = await bot.get("automod.mensagem_auto");
            const status = mensagem.system ? "`Ativado!`" : "`Desativado!`";
            let ok = mensagem.mensagem.map((a, index) => {return `(\`${index + 1}\`) - ${a.desc}`})
            .join("\n");
            if(mensagem.mensagem.length <= 0 ) {
                ok = "🛠 | Nenhuma mensagem definida!";
            };
            await interaction.update({
                embeds:[
                    new EmbedBuilder()
                    .setTitle("Configure abaixo o sistema de Mensagem Automática")
                    .setDescription(`⚙️ | Sistema: ${status}\n\n➡️** | Mensagens:**\n\n${ok}`)
                    .setColor("Random")
                    .setThumbnail(interaction.client.user.displayAvatarURL())
                    .setTimestamp()
                    .setFooter({text:`${interaction.guild.name}`, iconURL: interaction.guild.iconURL()})
                    .setAuthor({name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL()})
                ],
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_criarmsgauto`)
                        .setLabel("Criar Mensagem Automática")
                        .setEmoji("<:mais_cloud:1213643443897634956>")
                        .setStyle(3),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_removermsgauto`)
                        .setLabel("Remover Mensagem Automática")
                        .setEmoji("<:menos_cloud:1213652114891604039>")
                        .setStyle(4),
                    ),
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_onoffmsgauto`)
                        .setLabel("Ativar/Desativar Mensagens Automaticas")
                        .setEmoji("<:engrenagem_cloud:1213652588571004959>")
                        .setStyle(2),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_configmod123`)
                        .setLabel("Voltar")
                        .setStyle(2)
                        .setEmoji("⬅")
                    )
                ]
            })
        }
        async function mensagemautoedit() {
            const mensagem = await bot.get("automod.mensagem_auto");
            const status = mensagem.system ? "`Ativado!`" : "`Desativado!`";
            let ok = mensagem.mensagem.map((a, index) => {return `(\`${index + 1}\`) - ${a.desc}`})
            .join("\n");
            if(mensagem.mensagem.length <= 0 ) {
                ok = "🛠 | Nenhuma mensagem definida!";
            };
            await interaction.message.edit({
                embeds:[
                    new EmbedBuilder()
                    .setTitle("Configure abaixo o sistema de Mensagem Automática")
                    .setDescription(`⚙️ | Sistema: ${status}\n\n➡️** | Mensagens:**\n\n${ok}`)
                    .setColor("Random")
                    .setThumbnail(interaction.client.user.displayAvatarURL())
                    .setTimestamp()
                    .setFooter({text:`${interaction.guild.name}`, iconURL: interaction.guild.iconURL()})
                    .setAuthor({name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL()})
                ],
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_criarmsgauto`)
                        .setLabel("Criar Mensagem Automática")
                        .setEmoji("<:mais_cloud:1213643443897634956>")
                        .setStyle(3),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_removermsgauto`)
                        .setLabel("Remover Mensagem Automática")
                        .setEmoji("<:menos_cloud:1213652114891604039>")
                        .setStyle(4),
                    ),
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_onoffmsgauto`)
                        .setLabel("Ativar/Desativar Mensagens Automaticas")
                        .setEmoji("<:engrenagem_cloud:1213652588571004959>")
                        .setStyle(2),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_configmod123`)
                        .setLabel("Voltar")
                        .setStyle(2)
                        .setEmoji("⬅")
                    )
                ]
            })
        }
        async function autorole() {
            const roles = await bot.get("automod.autorole") || [];
            let kkk = roles.map((a) => {return `<@&${a}>`})
            .join("\n");
            if(roles.length <= 0) {
                kkk = `Nenhum Cargo Definido!`;
            }
            
            await interaction.update({
                embeds:[
                    new EmbedBuilder()
                    .setAuthor({name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL()})
                    .setTitle("Cargos Automáticos:")
                    .setDescription(`${kkk}`)
                    .setColor("Random")
                    .setThumbnail(interaction.client.user.displayAvatarURL())
                    .setFooter({text:`${interaction.guild.name}`, iconURL: interaction.guild.iconURL()})
                    .setTimestamp()
                ],
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_addcargoentrar`)
                        .setLabel("Adicionar Cargo Ao Entrar")
                        .setEmoji("<:mais_cloud:1213643443897634956>")
                        .setStyle(3),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_resetautoroles`)
                        .setStyle(4)
                        .setEmoji("🔁"),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_configmod123`)
                        .setLabel("Voltar")
                        .setStyle(2)
                        .setEmoji("⬅")
                    )
                ]
            })
        }
        async function chunlogs() {
            const logs_staff = interaction.guild.channels.cache.get(await vnd.get("logs_adm")) || "Não Configurado.";
            const logs_public = interaction.guild.channels.cache.get(await vnd.get("logs_public")) || "Não Configurado.";
            const fedd = interaction.guild.channels.cache.get(await vnd.get("channel_fedback")) || "Não Configurado.";
            const notifycart = await vnd.get(`notifycart`);
            const notifyaprovved = await vnd.get(`notifyaprovved`);
            const notifystock = await vnd.get(`notifystock`);
            await interaction.update({
                embeds:[
                    new EmbedBuilder()
                    .setTitle(`${emoji(5)} | Gerenciar Logs`)
                    .addFields(
                        {
                            name:`${emoji(26)} | Logs Públicas:`,
                            value:`Canal: ${logs_public}.`
                        },
                        {
                            name:`${emoji(42)} | Canal FeedBack:`,
                            value:`Canal: ${fedd}.`
                        },
                        {
                            name:`${emoji(26)} | Logs Administração:`,
                            value:`Canal: ${logs_staff}.\nNotificar quando alguém abrir/fechar um carrinho: \`${notifycart === true ? "Ativado" : "Desativado"}\`\nNotificar quando alguma compra for aprovada: \`${notifyaprovved === true ? "Ativado" : "Desativado"}\`\nNotificar quando acabar o estoque de algum produto: \`${notifystock === true ? "Ativado" : "Desativado"}\``
                        },
                    )
                ],
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_logspublic`)
                        .setLabel("Alterar Canal Logs Públicas")
                        .setEmoji("<:config_cloud:1213558269633892352>")
                        .setStyle(1),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_channelfdb`)
                        .setLabel("Alterar Canal FeedBack")
                        .setEmoji("<:config_cloud:1213558269633892352>") 
                        .setStyle(1),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_logsadm`)
                        .setLabel("Alterar Canal Logs Adm")
                        .setEmoji("<:config_cloud:1213558269633892352>") 
                        .setStyle(1),
                    ), 
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_logscarrinho`)
                        .setLabel("Logs Carrinho")
                        .setEmoji("<:engrenagem_cloud:1213652588571004959>")
                        .setStyle(notifycart === true ? 3 : 4),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_logsaprovved`)
                        .setLabel("Logs Compras Aprovadas")
                        .setEmoji("<:engrenagem_cloud:1213652588571004959>")
                        .setStyle(notifyaprovved=== true ? 3 : 4),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_logsstock`)
                        .setLabel("Logs Produtos sem estoque")
                        .setEmoji("<:engrenagem_cloud:1213652588571004959>")
                        .setStyle(notifystock=== true ? 3 : 4),
                    ),
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}__configchannel`)
                        .setStyle(2)
                        .setEmoji("⬅")
                        .setLabel("Voltar")
                    )
                ]
            })
        }
        async function chun() {
            
            const logs_staff = interaction.guild.channels.cache.get(await vnd.get("logs_adm")) || "Não Configurado.";
            const logs_public = interaction.guild.channels.cache.get(await vnd.get("logs_public")) || "Não Configurado.";
            const category = interaction.guild.channels.cache.get(await vnd.get("category")) || "Não Configurado.";
            const role = interaction.guild.roles.cache.get(await vnd.get("roles_client")) || "Não Configurado.";
            const fedd = interaction.guild.channels.cache.get(await vnd.get("channel_fedback")) || "Não Configurado.";


            await interaction.update({
                embeds:[
                    new EmbedBuilder()
                    .setAuthor({name:`${interaction.client.user.username}`, iconURL:interaction.client.user.displayAvatarURL()})
                    .setDescription(`Canal de FeedBack: ${fedd}\nCanal de Logs Adm Atual: ${logs_staff}\nCanal Logs Públicas Atual: ${logs_public}\nCategoria de Carrinhos Atual: ${category}\nCargo de Cliente Atual: ${role}`)
                ],
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_configlogs`)
                        .setLabel("Configurar Logs")
                        .setEmoji("<:config_cloud:1213558269633892352>")
                        .setStyle(1),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_categorycart`)
                        .setLabel("Alterar Categoria dos Carrinhos")
                        .setEmoji("<:config_cloud:1213558269633892352>")
                        .setStyle(1),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_rolesclient`)
                        .setLabel("Alterar Cargo de Cliente")
                        .setEmoji("<:config_cloud:1213558269633892352>")
                        .setStyle(1),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_voltar`)
                        .setLabel("Voltar")
                        .setEmoji("⬅")
                        .setStyle(2),
                        
                    )
                ]
            });
        }
        async function botmsg() {
            let banner = await bot.get(`banner`);
            let miniatura = await bot.get(`miniatura`);

            if(banner.startsWith("https://")){
                banner = `[Banner](${await bot.get("banner")})`
            }
            if(miniatura.startsWith("https://")){
                miniatura = `[Miniatura](${await bot.get("miniatura")})`
            }
            
           await interaction.message.edit({
                embeds:[
                    new EmbedBuilder()
                    .setAuthor({name:`${interaction.client.user.username}`, iconURL:interaction.client.user.displayAvatarURL()})
                    .setDescription(`Nome Atual: **${interaction.client.user.username}*\nAvatar Atual: [Avatar](${interaction.client.user.displayAvatarURL()})\nCor Padrão do Bot Atual: \`${await bot.get(`cor`)}\`\nBanner Atual: ${banner}\nMiniatura Atual: ${miniatura}\n\n**Você pode configurar o bot usando os botões abaixo:**`)
                    .setColor("Random")
                ],
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_alterarnome`)
                        .setStyle(1)
                        .setEmoji("<:config_cloud:1213558269633892352>")
                        .setLabel("Alterar Nome"),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_alteraravatar`)
                        .setStyle(1)
                        .setEmoji("<:config_cloud:1213558269633892352>")
                        .setLabel("Alterar Avatar"),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_alterarcor`)
                        .setStyle(1)
                        .setEmoji("<:config_cloud:1213558269633892352>")
                        .setLabel("Alterar Cor Padrão do bot"),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_alterarbanner`)
                        .setStyle(1)
                        .setEmoji("<:config_cloud:1213558269633892352>")
                        .setLabel("Alterar Banner"),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_alterarminiatura`)
                        .setStyle(1)
                        .setEmoji("<:config_cloud:1213558269633892352>")
                        .setLabel("Alterar Miniatura"),
                    ),
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_altstatus`)
                        .setLabel("Alterar o Status do bot")
                        .setEmoji("<:config_cloud:1213558269633892352>")
                        .setStyle(1),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_voltar`)
                        .setLabel("Voltar")
                        .setEmoji("⬅")
                        .setStyle(2),
                    )
                ]
            })
        }
        async function semiauto() {
            
            let image = await vnd.get("qrcode"); 
            if(image.startsWith("https://")) {
                image = `[Qr Code](${await vnd.get("qrcode")})`;
            }

            const chave = await vnd.get("chavepix");
            const tipochave = await vnd.get("tipochave");
            let chs = "";
            if(chave === "Não Configurado" && tipochave === "Não Configurado") {
                chs = 'Não Configurado'
            } else {
                chs = `\`${tipochave}\` - ${chave}`
            }

            await interaction.update({
                
        embeds:[
            new EmbedBuilder()
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .setAuthor({name:`${interaction.client.user.username}`, iconURL:interaction.client.user.displayAvatarURL()})
            .setTitle(`${emoji(26)} | Sistema de Pagamento Semi Automático.`)
            .setDescription(`${emoji(5)} | Sistema: ${await vnd.get("semiauto") === true ? "ON" : "OFF"}\n${emoji(36)} | Chave Pix: ${chs}\n${emoji(15)} | Qr Code: ${image}`)
            .setColor("Random")
        ],
        components:[
            new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId(`${interaction.user.id}_semiautoonoff`)
                .setLabel("Semiauto ON/OFF")
                .setStyle(await vnd.get("semiauto") === true ? 3 : 4)
                .setEmoji("<:engrenagem_cloud:1213652588571004959>"),
                new ButtonBuilder()
                .setCustomId(`${interaction.user.id}_chavepix`)
                .setLabel("Chave Pix")
                .setEmoji("<:Pix:1221876826402586835>")
                .setStyle(2),
                new ButtonBuilder()
                .setCustomId(`${interaction.user.id}_qrcode`)
                .setLabel("Qr Code")
                .setEmoji("<:qrcode_cloud:1221878642267652139>")
                .setStyle(2),
                new ButtonBuilder()
                .setCustomId(`${interaction.user.id}_configpag`)
                .setLabel("Voltar")
                .setStyle(2)
                .setEmoji("⬅"),
            )
        ]
            })
        }
        async function botp() {
            let banner = await bot.get(`banner`);
            let miniatura = await bot.get(`miniatura`);

            if(banner.startsWith("https://")){
                banner = `[Banner](${await bot.get("banner")})`
            }
            if(miniatura.startsWith("https://")){
                miniatura = `[Miniatura](${await bot.get("miniatura")})`
            }
            
           await interaction.update({
                embeds:[
                    new EmbedBuilder()
                    .setAuthor({name:`${interaction.client.user.username}`, iconURL:interaction.client.user.displayAvatarURL()})
                    .setDescription(`Nome Atual: **${interaction.client.user.username}**\nAvatar Atual: [Avatar](${interaction.client.user.displayAvatarURL()})\nCor Padrão do Bot Atual: \`${await bot.get(`cor`)}\`\nBanner Atual: ${banner}\nMiniatura Atual: ${miniatura}\n\n**Você pode configurar o bot usando os botões abaixo:**`)
                    .setColor("Random")
                ],
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_alterarnome`)
                        .setStyle(1)
                        .setEmoji("<:config_cloud:1213558269633892352>")
                        .setLabel("Alterar Nome"),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_alteraravatar`)
                        .setStyle(1)
                        .setEmoji("<:config_cloud:1213558269633892352>")
                        .setLabel("Alterar Avatar"),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_alterarcor`)
                        .setStyle(1)
                        .setEmoji("<:config_cloud:1213558269633892352>")
                        .setLabel("Alterar Cor Padrão do bot"),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_alterarbanner`)
                        .setStyle(1)
                        .setEmoji("<:config_cloud:1213558269633892352>")
                        .setLabel("Alterar Banner"),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_alterarminiatura`)
                        .setStyle(1)
                        .setEmoji("<:config_cloud:1213558269633892352>")
                        .setLabel("Alterar Miniatura"),
                    ),
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_altstatus`)
                        .setLabel("Alterar o Status do bot")
                        .setEmoji("<:config_cloud:1213558269633892352>")
                        .setStyle(1),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_voltar`)
                        .setLabel("Voltar")
                        .setEmoji("⬅")
                        .setStyle(2),
                    )
                ]
            })
        }
        async function duvida() {
            const duv = await bot.get("duvidas");
            const channel = interaction.guild.channels.cache.get(duv.channel) || "`Não Configurado`";
            const status = duv.status ? "`Ativado!`" : "`Desativado!`";

            await interaction.update({
                content:"",
                embeds:[
                    new EmbedBuilder()
                    .setAuthor({name:`${interaction.client.user.username}`, iconURL: interaction.client.user.displayAvatarURL()})
                    .setThumbnail(interaction.client.user.displayAvatarURL())
                    .setFooter({text:`${interaction.guild.name}`, iconURL: interaction.guild.iconURL()})
                    .setTimestamp()
                    .setColor("Random")
                    .setDescription(`Status Dúvidas: ${status}\nCanal de Redirecionamento: ${channel}\nTexto Button: \`${duv.label}\`\nEmoji: ${duv.emoji}`)
                ],
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_ativoffduvidas`)
                        .setLabel("Ativar/Desativar Botão de Duvidas")
                        .setStyle(2)
                        .setEmoji("<:config_cloud:1213558269633892352>"),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_canalredicduvidas`)
                        .setLabel("Alterar Canal de Redirecionamento")
                        .setStyle(1)
                        .setEmoji("<:config_cloud:1213558269633892352>"),
                    ),
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_textobuttonduvida`)
                        .setLabel("Alterar Texto do Botão")
                        .setStyle(1)
                        .setEmoji("<:config_cloud:1213558269633892352>"),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_emojibuttonduvida`)
                        .setLabel("Alterar Emoji do Botão")
                        .setStyle(1)
                        .setEmoji("<:config_cloud:1213558269633892352>"),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_voltar`)
                        .setLabel("Voltar")
                        .setStyle(2) 
                        .setEmoji("⬅"),
                    ),
                ]
            })

        }
        async function duvidaedit() {
            const duv = await bot.get("duvidas");
            const channel = interaction.guild.channels.cache.get(duv.channel) || "`Não Configurado`";
            const status = duv.status ? "`Ativado!`" : "`Desativado!`";

            await interaction.message.edit({
                content:"",
                embeds:[
                    new EmbedBuilder()
                    .setAuthor({name:`${interaction.client.user.username}`, iconURL: interaction.client.user.displayAvatarURL()})
                    .setThumbnail(interaction.client.user.displayAvatarURL())
                    .setFooter({text:`${interaction.guild.name}`, iconURL: interaction.guild.iconURL()})
                    .setTimestamp()
                    .setColor("Random")
                    .setDescription(`Status Dúvidas: ${status}\nCanal de Redirecionamento: ${channel}\nTexto Button: \`${duv.label}\`\nEmoji: ${duv.emoji}`)
                ],
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_ativoffduvidas`)
                        .setLabel("Ativar/Desativar Botão de Duvidas")
                        .setStyle(2)
                        .setEmoji("<:config_cloud:1213558269633892352>"),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_canalredicduvidas`)
                        .setLabel("Alterar Canal de Redirecionamento")
                        .setStyle(1)
                        .setEmoji("<:config_cloud:1213558269633892352>"),
                    ),
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_textobuttonduvida`)
                        .setLabel("Alterar Texto do Botão")
                        .setStyle(1)
                        .setEmoji("<:config_cloud:1213558269633892352>"),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_emojibuttonduvida`)
                        .setLabel("Alterar Emoji do Botão")
                        .setStyle(1)
                        .setEmoji("<:config_cloud:1213558269633892352>"),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_voltar`)
                        .setLabel("Voltar")
                        .setStyle(2) 
                        .setEmoji("⬅"),
                    ),
                ]
            })

        }
        async function saldo() {
            
           await interaction.update({
                embeds:[
                    new EmbedBuilder()
                    .setThumbnail(interaction.client.user.displayAvatarURL())
                    .setAuthor({name:`${interaction.client.user.username}`, iconURL:interaction.client.user.displayAvatarURL()})
                    .setTitle(`${emoji(45)} **| Configurar Sistema de Saldo**`)
                    .setDescription(`Sistema de Saldo: ${await vnd.get(`saldo`) === true ? "ON" : "OFF"}\nBônus por depósito: ${await vnd.get(`saldobonus`)}%\nValor minimo para depósito: R$ ${await vnd.get("saldomin")}`)
                    .setColor("Random")
                ],
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_saldoonoff`)
                        .setLabel("Saldo ON/OFF")
                        .setEmoji("<:engrenagem_cloud:1213652588571004959>")
                        .setStyle(await vnd.get(`saldo`) === true ? 3 : 4),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_bonusdep`)
                        .setLabel("Bônus por Depósito")
                        .setEmoji("<:engrenagem_cloud:1213652588571004959>")
                        .setStyle(1),
                        new ButtonBuilder() 
                        .setCustomId(`${userid}_configpag`)
                        .setLabel("Voltar")
                        .setEmoji("⬅")
                        .setStyle(2),
                    )
                ]
            })
        }
        async function mp() {
            await interaction.update({
                embeds:[
                    new EmbedBuilder()
                    .setThumbnail(interaction.client.user.displayAvatarURL())
                    .setAuthor({name:`${interaction.client.user.username}`, iconURL:interaction.client.user.displayAvatarURL()})
                    .setTitle(`${emoji(25)} | Configurar Mercado Pago`)
                    .setColor("Random")
                    .setDescription(`${emoji(36)} | Pix: ${vnd.get(`pix`) === true ? "ON" : "OFF"}\n${emoji(25)} | Pagar pelo Site: ${vnd.get(`pagarsite`) === true ? "ON" : "OFF"}\n${emoji(19)} | Tempo Máximo para pagar: ${vnd.get(`tempmax`)} minutos\n${emoji(5)} | Access Token: || ${vnd.get(`acess_token`)} ||\n${emoji(2)} | Bancos Bloqueados: ${await bot.get("banks").join(" , ")}`)
                ],
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_pixonoff`)
                        .setLabel("Pix ON/OFF")
                        .setEmoji("<:engrenagem_cloud:1213652588571004959>")
                        .setStyle(vnd.get(`pix`) === true ? 3 : 4),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_siteonoff`)
                        .setLabel("Site ON/OFF")
                        .setEmoji("<:engrenagem_cloud:1213652588571004959>")
                        .setStyle(vnd.get(`pagarsite`) === true ? 3 : 4),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_temppagar`)
                        .setLabel("Tempo para Pagar")
                        .setEmoji("<:relogio_cloud:1221880072265269409>")
                        .setStyle(2),
                        new ButtonBuilder() 
                        .setCustomId(`${userid}_acesstokenmudar`)
                        .setLabel("Alterar Acess Token")
                        .setEmoji("<:MercadoPago:1221877449340752002>")
                        .setStyle(2),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_blockbank`)
                        .setLabel("Bloquear Bancos")
                        .setEmoji("<:info_startcommunity:1193797249612922982>")
                        .setStyle(2),
                    ),
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_configpag`)
                        .setLabel("Voltar")
                        .setEmoji("⬅")
                        .setStyle(2),
                    )
                ]
            })
            
        }
        function resettime() {
            
        if (timer[interaction.message.id]) {
            clearTimeout(timer[interaction.message.id]);
        }
        timer[interaction.message.id] = setTimeout(() => {
            if(interaction.message) {
                interaction.message.edit({
                    content:"⚠️ | Use o Comando Novamente!",
                    components:[],
                    embeds:[],
                    files:[]
                }); 
            }
        }, 600000);
        }
        
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