const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType, ModalBuilder, TextInputBuilder } = require("discord.js");
const {bot,carrinho,db,logs,pn,rd,vnd, token , personalizar, perm} = require("../../database/index");


module.exports = {
    name:"criar",
    description:"[🛠|💰 Vendas Moderação] Cadastra um novo produto no bot",
    type: ApplicationCommandType.ChatInput,
    options:[
        {
            name:"id",
            description:"Coloque o ID do novo produto aqui!",
            type: ApplicationCommandOptionType.String,
            required:true,
        }
    ],
    run:async(client, interaction) => {
        const id = interaction.options.getString("id");
        if(!await perm.get(`${interaction.user.id}`)) return await interaction.reply({embeds:[ new EmbedBuilder().setDescription(`⚠️ | Você não possui permissão para utilizar este comando!`).setColor("Red")],ephemeral:true});
        const prod = await db.get(`${id}`);
        if(prod) return interaction.reply({content:`🔍 | Já existe um produto com esse id, ele está localizado no canal: <#${prod.mensagem.channel}>. use /config ${id}, para configura-lo`, ephemeral:true});
        if(id.includes("_")) return interaction.reply({content:`${personalizar.get("29")} | Não Coloque anderlaine(_)!`, ephemeral:true})
        bot.set("mensagem_compra.titulo", `${interaction.client.user.username} | Produto`)
        await interaction.reply({content:`🔁 | Aguarde um Momento`, ephemeral:true});
        try {
            const embed = new EmbedBuilder()
            .setColor(await bot.get(`cor`));

            let title = await bot.get("mensagem_compra.titulo");
            title = title.replace("#{nome}", "Não configurado ainda...");
            title = title.replace("#{preco}", "10");
            title = title.replace("#{estoque}", "0");
            embed.setTitle(`${title}`);
            let desc = await bot.get("mensagem_compra.desc");
            desc = desc.replace("#{nome}", "Não configurado ainda...");
            desc = desc.replace("#{preco}", "10");
            desc = desc.replace("#{estoque}", "0");
            desc = desc.replace("#{desc}", "Não configurado ainda...");
            embed.setDescription(desc);
            const mensagem_compra = await bot.get("mensagem_compra");

            if(await bot.get("banner").startsWith("https://")) {
                embed.setImage(await bot.get("banner"));
            }
            if(await bot.get("miniatura").startsWith("https://")) {
                embed.setThumbnail(await bot.get("banner"));
            }
            if(mensagem_compra.rodape !== "Sem Rodapé") {
                embed.setFooter({text:`${mensagem_compra.rodape}`})
            }
            const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId(`${id}_produto`)
                .setLabel(mensagem_compra.button.text)
                .setStyle(Number(mensagem_compra.button.style)) 
                .setEmoji(mensagem_compra.button.emoji)
            );
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
            const msg = await interaction.channel.send({
                embeds:[
                    embed
                ],
                components:[
                    row
                ]
            }).then(async(msg) => {
                interaction.editReply({content:`✅ | Produto Criado com sucesso!, use /config \`${id}\` para configura-lo`});
                await db.set(`${id}`, {
                    idproduto:id,
                    nome: "Não configurado ainda...",
                    preco: 10,
                    miniatura:await bot.get("miniatura"),
                    banner:await bot.get("banner"),
                    conta:[],
                    desc:"Não configurado ainda...",
                    category:"Não Definida.",
                    rodape: mensagem_compra.rodape,
                    role:"Não Configurado",
                    cor:`${await bot.get(`cor`)}`,
                    cupom:true,
                    mensagem: {
                        channel: interaction.channel.id,
                        msgid: msg.id
                    },
                    estatisticas:{
                        total:0,
                        rendeu:0.00,
                    },
                    espera:[]
                })
            }).catch((err) => {
                interaction.editReply({content:`⚠ | Ocorreu um erro: \n ${err.message}`});
            });
        } catch (err) {
            interaction.editReply({content:`⚠ | Ocorreu um erro: \n ${err.message}`});
        }
    }}