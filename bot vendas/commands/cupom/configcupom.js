const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType, ModalBuilder, TextInputBuilder } = require("discord.js");
const {bot,carrinho,db,logs,pn,rd,vnd, token , personalizar, perm, cupom} = require("../../database/index");


module.exports = {
    name:"configcupom",
    description:"[🛠|💰 Vendas Moderação] Configure um Cupom",
    type: ApplicationCommandType.ChatInput,
    options:[
        {
            name:"nome",
            description:"Coloque o nome do Cupom aqui!",
            type: ApplicationCommandOptionType.String,
            required:true,
            autocomplete: true,
        }
    ],
    async autocomplete(interaction) {
      const value = interaction.options.getFocused().toLowerCase();
      let choices = cupom.all()
  
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
              filtered.map(choice => ({ name: `✔| CUPOM - ${choice.ID} 💸 | Desconto - ${choice.data.porcentagem}% 📦 | Quantidade - ${choice.data.quantidade}`, value: choice.ID}))
          );
      }

  },  
  run:async (client,interaction) => {
    const id = interaction.options.getString("nome");
    if(!await perm.get(`${interaction.user.id}`)) return await interaction.reply({embeds:[ new EmbedBuilder().setDescription(`⚠️ | Você não possui permissão para utilizar este comando!`).setColor("Red")],ephemeral:true});
    const cm = await cupom.get(`${id}`); 
    if(!cm) return interaction.reply({content:`${emoji(29)} | Não existe nenhum cupom com este nome`, ephemeral:true});
    const role = interaction.guild.roles.cache.get(cm.cargo) || "Este cupom pode ser utilizado por qualquer usuário!";
    const userid = interaction.user.id;


    interaction.reply({
        embeds:[
            new EmbedBuilder()
            .setTitle(`${interaction.guild.name} | Gerenciar Cupom`)
            .setDescription(`${emoji(12)} **| Nome:** \`${id}\`\n${emoji(3)} **| Porcentagem de Desconto:** \`${cm.porcentagem}\`\n${emoji(14)} **| Valor Minimo:** \`${cm.valorminimo}\`\n${emoji(21)} **| Quantidade:** \`${cm.quantidade}\`\n🔒 **| Sò pode ser usado pelo cargo:** ${role}`)
            .setColor(await bot.get("cor"))
            .setFooter({text:`${interaction.guild.name} - Todos os Direitos reservados.`, iconURL: interaction.client.user.displayAvatarURL()})
            .setThumbnail(interaction.client.user.displayAvatarURL())
        ],
        components:[
            new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId(`${userid}_${id}_porcentagemdesconto`)
                .setLabel("Porcentagem de desconto")
                .setStyle(3)
                .setEmoji("<:Dinheiro_cloud:1221872674188562443>"),
                new ButtonBuilder()
                .setCustomId(`${userid}_${id}_valormincupom`)
                .setLabel("Valor Mínimo")
                .setStyle(3)
                .setEmoji("<:carrin_cloud:1221873043958268045>"),
                new ButtonBuilder()
                .setCustomId(`${userid}_${id}_quantidadecupom`)
                .setLabel("Quantidade")
                .setStyle(3)
                .setEmoji("<:folha_cloud:1221870992817782936>"),
                new ButtonBuilder()
                .setCustomId(`${userid}_${id}_cargocupom`)
                .setLabel("Cargo")
                .setStyle(3)
                .setEmoji("<:users_cloud:1213635311905669203>"),
            ),
            new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId(`${userid}_${id}_deletecupom`)
                .setLabel("DELETAR")
                .setStyle(4)
                .setEmoji("<:lixo_cloud:1221875710956797992>"),
            ),
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

  function emoji(id) {
      try {
          const emj = personalizar.get(`${id}`);
          return emj || "❌";
      } catch {
          return "❌"
      }
  }