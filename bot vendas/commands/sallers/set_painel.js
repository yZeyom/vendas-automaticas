const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType, ModalBuilder, TextInputBuilder, StringSelectMenuBuilder } = require("discord.js");
const {bot,carrinho,db,logs,pn,rd,vnd, token , personalizar, perm} = require("../../database/index");
const pd = db;


module.exports = {
    name:"set_painel",
    description:"[🛠|💰 Vendas Moderação] Sete o Painel",
    type: ApplicationCommandType.ChatInput,
    options:[
        {
            name:"id",
            description:"Coloque o ID do painel que será setado aqui!",
            type: ApplicationCommandOptionType.String,
            required:true,
            autocomplete: true,
        }
    ],
    async autocomplete(interaction) {
      const value = interaction.options.getFocused().toLowerCase();
      let choices = pn.all()
  
      const filtered = choices.filter(choice => choice.ID.toLowerCase().includes(value)).slice(0, 25);
  
      if(!interaction) return;
      if(!await perm.get(`${interaction.user.id}`)){
        await interaction.respond([
            { name: "Você não tem permissão para usar esse comando!", value: "vcnaotempermlolkkkkk" }
        ]);
      } else if(choices.length === 0){ 
          await interaction.respond([
              { name: "Você não tem nenhum painel criado!", value: "a22139183954312asd92384XASDASDSADASDSADASDASD12398212222" }
          ]);
      } else if(filtered.length === 0) {
          await interaction.respond([
              { name: "Não Encontrei esse painel", value: "a29sad183912a213sd92384XASDASDSADASDSADASDASD1239821" }
          ]);
      } else {
          await interaction.respond(
              filtered.map(choice => ({ name: `🗄 | Painel: ${choice.ID}`, value: choice.ID}))
          );
      }

  },  
  run:async (client,interaction) => {
    const db = pn;
    const id = interaction.options.getString("id");
    if(!await perm.get(`${interaction.user.id}`)) return await interaction.reply({embeds:[ new EmbedBuilder().setDescription(`⚠️ | Você não possui permissão para utilizar este comando!`).setColor("Red")],ephemeral:true});
    const prod = await db.get(`${id}`);
    if(!prod) return interaction.reply({content:`❌ | Este Painel não existe`, ephemeral:true});

    const channel = interaction.guild.channels.cache.get(prod.mensagem.channel);
    await interaction.reply({content:`🔁 | Aguarde um momento...`, ephemeral:true});
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
    
       try {
        channel.messages.fetch(prod.mensagem.msgid)
           .then(async message => {
               try {
                if(message) {
                    message.delete().catch((e) => {console.log("Acontece")})
                }
               } catch {
                console.log("Acotnece")
               }
           })
           .catch(error => {
               console.error(`Erro ao editar mensagem: ${error}`);
           });
       } catch {
        console.log("Acontece")
       }
   }

   await interaction.channel.send({
    embeds: [embed],
    components:[
        new ActionRowBuilder() 
        .addComponents(
            select
        )
    ]
   }).then((msg) => {
    db.set(`${id}.mensagem`, {
        msgid: msg.id,
        channel: interaction.channel.id
    })
   });
   
} catch {
    interaction.editReply({content:`⚠ | Ocorreu um erro ao tentar atualizar a mensagem`, ephemeral:true});
} finally {
    interaction.editReply(`✅ | Painel Setado com sucesso`)
}
  }}