const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType, ModalBuilder, TextInputBuilder } = require("discord.js");
const {bot,carrinho,db,logs,pn,rd,vnd, token , personalizar, perm} = require("../../database/index");


module.exports = {
    name:"set",
    description:"[🛠|💰 Vendas Moderação] Cria a mensagem de compra do produto",
    type: ApplicationCommandType.ChatInput,
    options:[
        {
            name:"id",
            description:"Coloque o ID do produto que será setado aqui!",
            type: ApplicationCommandOptionType.String,
            required:true,
            autocomplete: true,
        }
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
  run:async (client,interaction) => {
    const id = interaction.options.getString("id");
    if(!await perm.get(`${interaction.user.id}`)) return await interaction.reply({embeds:[ new EmbedBuilder().setDescription(`⚠️ | Você não possui permissão para utilizar este comando!`).setColor("Red")],ephemeral:true});
        const prod = await db.get(`${id}`);
        if(!prod) return interaction.reply({content:`🔍 | Produto inexistente`, ephemeral:true});
        await interaction.reply({content:`🔁 | Aguarde um Momento`, ephemeral:true});
        const colorembed = await bot.get("cor");
        const channel = interaction.guild.channels.cache.get(prod.mensagem.channel);
       try {
        const embed = new EmbedBuilder()
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

           if(await prod.banner.startsWith("https://")) {
               embed.setImage(prod.banner);
           }
           if(await prod.miniatura.startsWith("https://")) {
               embed.setThumbnail(prod.miniatura);
           }
           if(mensagem_compra.rodape !== "Sem Rodapé") {
               embed.setFooter({text:`${mensagem_compra.rodape}`})
           }
      if (channel && channel.messages.fetch(prod.mensagem.msgid)) {
       
        try {
            const message = channel.messages.fetch(prod.mensagem.msgid).catch(() => {console.log("mensagem não encontrada.")});
            
            if (message) {
            message.delete().catch(() => {console.log("Mensagem nao encontrada.")})
            }
          } catch (error) {
            console.error(`Erro ao excluir mensagem (${prod.mensagem.msgid}):`, error.message);
          }
          
      }
      const row = new ActionRowBuilder()
      .addComponents(
          new ButtonBuilder()
          .setCustomId(`${id}_produto`)
          .setLabel(`${mensagem_compra.button.text}`)
          .setStyle(Number(mensagem_compra.button.style))
          .setEmoji(`${mensagem_compra.button.emoji}`)
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
   await interaction.channel.send({ embeds: [embed],
    components:[
        row
    ]}).then(async(msg) => {
        await db.set(`${id}.mensagem`, {
            "channel": interaction.channel.id,
            "msgid": msg.id
        })
        await interaction.editReply({content:"✅ | Produto setado com sucesso!"});
    })

   } catch(err) {
       interaction.editReply({content:`⚠ | Ocorreu um erro ao tentar setar a mensagem\n\n Mensagem do Erro: ${err.message}`, ephemeral:true});
   }


    }}