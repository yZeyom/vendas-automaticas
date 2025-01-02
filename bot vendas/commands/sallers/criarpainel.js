const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType, ModalBuilder, TextInputBuilder, StringSelectMenuBuilder } = require("discord.js");
const {bot,carrinho,db,logs,pn,rd,vnd, token , personalizar, perm} = require("../../database/index");


module.exports = {
    name:"criarpainel",
    description:"[🛠|💰 Vendas Moderação] Crie um Painel Select Menu Para Seus Produtos",
    type: ApplicationCommandType.ChatInput,
    options:[
        {
            name:"id",
            description:"Coloque um id para o seu painel!",
            type: ApplicationCommandOptionType.String,
            required:true,
        },
        {
            name:"produto_id",
            description:"Coloque o id do produto para ser adicionado no!",
            type: ApplicationCommandOptionType.String,
            required:true,
            autocomplete: true,
        },
    ],
    async autocomplete(interaction) {
      const value = interaction.options.getFocused().toLowerCase();
      let choices = db.all()
  
      const filtered = choices.filter(choice => choice.ID.toLowerCase().includes(value)).slice(0, 25);
  
      if(!interaction) return;
      if(!await perm.get(`${interaction.user.id}`)){
        await interaction.respond([
            { name: "Você não tem permissão para usar esse comando!", value: "vcnaotempermlolkkkkk" }
        ]);
      } else if(choices.length === 0){ 
          await interaction.respond([
              { name: "Você não tem nenhum produto criado!", value: "a22139183954312asd92384XASDASDSADASDSADASDASD12398212222" }
          ]);
      } else if(filtered.length === 0) {
          await interaction.respond([
              { name: "Não Encontrei esse produto", value: "a29sad183912a213sd92384XASDASDSADASDSADASDASD1239821" }
          ]);
      } else {
          await interaction.respond(
              filtered.map(choice => ({ name: `ID - ${choice.ID} | Nome - ${choice.data.nome}`, value: choice.ID}))
          );
      }

  },  
    run:async(client, interaction) => {
        const id = interaction.options.getString("id");
        const idp = interaction.options.getString("produto_id");
        if(!await perm.get(`${interaction.user.id}`)) return await interaction.reply({embeds:[ new EmbedBuilder().setDescription(`⚠️ | Você não possui permissão para utilizar este comando!`).setColor("Red")],ephemeral:true});
        if(id.includes("_")) return interaction.reply({content:`${personalizar.get("29")} | Não Coloque anderlaine(_)!`, ephemeral:true});
        const prod = await db.get(`${idp}`);
        if(!prod) return interaction.reply({content:`🔍 | Não existe um produto com esse id, ele está localizado no canal: <#${prod.mensagem.channel}>. use /config ${idp}, para configura-lo`, ephemeral:true})
        const pai = await pn.get(`${id}`);
        if(pai) return interaction.reply({content:`🔍 | Já existe um painel com esse id, ele está localizado no canal: <#${pai.mensagem.channel}>. use /config_painel ${id}, para configura-lo`, ephemeral:true})
        
        await interaction.reply({content:`🔁 | Aguarde um Momento`, ephemeral:true});
        try {
            const embed = new EmbedBuilder()
            .setColor(await bot.get(`cor`));

            await interaction.channel.send({
                embeds:[
                    embed.setTitle(`${id} | Painel`)
                    .setDescription(`Não Configurado ainda...`)
                ],
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                        .setCustomId(`${id}_painel`)
                        .setMaxValues(1)
                        .addOptions(
                            {
                                label:`${prod.nome}`,
                                emoji:`${personalizar.get("14")}`,
                                description:`💸 | Valor: R$${prod.preco} - 📦 | Estoque: ${prod.conta.length}`,
                                value: idp
                            }
                        )
                        .setPlaceholder("Selecione um Produto")
                    )
                ]
            }).then(async(msg) => {
                await pn.set(`${id}`, {
                    title: `${id} | Painel`,
                    desc:"Não Configurado ainda...",
                    rodape:"Sem Rodapé",
                    placeholder:"Selecione um Produto",
                    corembed:`${await bot.get(`cor`)}`, 
                    banner:"remover",
                    miniatura:"remover",
                    mensagem:{
                        channel: interaction.channel.id,
                        msgid: msg.id
                    },
                    produtos:[
                        {
                            id: idp,
                            emoji:`${personalizar.get("14")}`
                        }
                    ]
                });

                interaction.editReply({content:`✅ | Painel criado com sucesso! use /config_painel \`${id}\` Para Configura-lo`})
            })

        } catch (err) {
            interaction.editReply({content:`⚠ | Ocorreu um erro: \n ${err.message}`});
        }
    }}