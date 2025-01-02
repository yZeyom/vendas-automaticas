const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType, ModalBuilder, TextInputBuilder } = require("discord.js");
const {bot,carrinho,db,logs,pn,rd,vnd, token , personalizar, perm} = require("../../database/index");


module.exports = {
    name:"config",
    description:"[🛠|💰 Vendas Moderação] Configure um produto",
    type: ApplicationCommandType.ChatInput,
    options:[
        {
            name:"id",
            description:"Coloque o id do produto que deseja configurar!",
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
        await interaction.reply({content:`🔁 | Aguarde um Momento`, ephemeral:false});
        const colorembed = await bot.get("cor");
        try{

            interaction.editReply({
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
                        .setEmoji("📗")
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
            const filter = i => i.user.id === interaction.user.id;
    
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });
    
            collector.on('collect', async i => {
                if(interaction.customId === `${interaction.user.id}_mudarnomeprod`){}
                if(interaction.customId === `${interaction.user.id}_mudarprecoprod`){}
                if(interaction.customId === `${interaction.user.id}_mudardescprod`){}
                if(interaction.customId === `${interaction.user.id}_mudarestoqueprod`){}
                if(interaction.customId === `${interaction.user.id}_configadvprod`){}
                if(interaction.customId === `${interaction.user.id}_atualizarmensagemprod`){}
                if(interaction.customId === `${interaction.user.id}_deleteprod`){}
            });
            collector.on('end', collected => { 
                if (collected.size === 0) interaction.editReply({ content: '⚠️ | Use o Comando Novamente!', components: [], embeds:[] });
            });
    

        } catch{

        }
  }
}