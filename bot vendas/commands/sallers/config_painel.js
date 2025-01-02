const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType, ModalBuilder, TextInputBuilder, StringSelectMenuBuilder } = require("discord.js");
const {bot,carrinho,db,logs,pn,rd,vnd, token , personalizar, perm} = require("../../database/index");


module.exports = {
    name:"config_painel",
    description:"[🛠|💰 Vendas Moderação] Configure um Painel",
    type: ApplicationCommandType.ChatInput,
    options:[
        {
            name:"id",
            description:"Coloque um id para o seu painel!",
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
    run:async(client, interaction) => {
        const id = interaction.options.getString("id");
        if(!await perm.get(`${interaction.user.id}`)) return await interaction.reply({embeds:[ new EmbedBuilder().setDescription(`⚠️ | Você não possui permissão para utilizar este comando!`).setColor("Red")],ephemeral:true});
        const prod = await pn.get(`${id}`);
        const colorembed = await bot.get("cor");
        if(!prod) return interaction.reply({content:`🔍 | Painel inexistente`, ephemeral:true});
        interaction.reply({
            embeds:[
                new EmbedBuilder()
                .setColor(colorembed)
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
        const filter = i => i.user.id === interaction.user.id;
    
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });
    
            collector.on('collect', async i => {
                
            });
            collector.on('end', collected => { 
                if (collected.size === 0) interaction.editReply({ content: '⚠️ | Use o Comando Novamente!', components: [], embeds:[] });
            });
    
    }}