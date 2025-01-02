const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType, ModalBuilder, TextInputBuilder } = require("discord.js");
const {bot,carrinho,db,logs,pn,rd,vnd, token , personalizar, perm} = require("../../database/index");
const fs = require("fs");

module.exports = {
    name:"stockid",
    description:"[🛠|💰 Vendas Moderação] Veja o stock de um determinado produto.",
    type: ApplicationCommandType.ChatInput,
    options:[
        {
            name:"id",
            description:"Coloque o ID do produto aqui!",
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
  run:async (client,interaction) => {
    const id = interaction.options.getString("id");
    if(!await perm.get(`${interaction.user.id}`)) return await interaction.reply({embeds:[ new EmbedBuilder().setDescription(`⚠️ | Você não possui permissão para utilizar este comando!`).setColor("Red")],ephemeral:true});
    const prod = await db.get(`${id}`);
    if(!prod) return interaction.reply({content:`${emoji(12)} | Não foi encontrado nenhum produto com esse ID`, ephemeral:true});  
    var quantia = 1;
      var contas = `${db.get(`${id}.conta`)}`.split(',');
      var backup = `📦 | ${contas.join(`\n📦 | `)}`
      const pastainbiza = `a.txt`;
      fs.writeFile(`a.txt`, `📦 | Seu Estoque:\n${backup}`, (err) => {
       if (err) throw err;
       console.log(`Arquivo de Estoque ${id} criado!`);
             });
       const embedinbiza = new EmbedBuilder()
       .setTitle(`Mostrando estoque de: ${id}`)
       .setDescription(`\`\`Estoque no arquivo txt.\`\``)
       .setColor(bot.get("cor"))
       .setFooter({ text: `${interaction.guild.name} - Todos os direitos reservados.`, iconURL: interaction.user.avatarURL({ dynamic: true })})
    await interaction.reply({ files: [pastainbiza], embeds: [embedinbiza], ephemeral: true })
        
          fs.unlink(inbiza, (err) => {
            if (err) {
              console.error(`Erro ao apagar o arquivo: ${err}`);
              return;
            }
            console.log(`Arquivo foi apagado com sucesso.`);
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