const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType, ModalBuilder, TextInputBuilder } = require("discord.js");
const {bot,carrinho,db,logs,pn,rd,vnd, token , personalizar, perm} = require("../../database/index");


module.exports = {
    name:"entregar",
    description:"[🛠|💰 Vendas Moderação] Entregue um produto a um usúario.",
    type: ApplicationCommandType.ChatInput,
    options:[
        {
            name:"id",
            description:"ID do Produto",
            type: ApplicationCommandOptionType.String,
            required:true,
            autocomplete: true,
        },
        {
            name:"usuário",
            description:"Mencione o usuário que irá receber o produto",
            type: ApplicationCommandOptionType.User,
            required:true
        },
        {
            name:"quantidade",
            description:"Selecione a quantidade que será entregue ao usuário",
            type: ApplicationCommandOptionType.Number,
            required:true
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
    const user = interaction.options.getUser("usuário");
    const quantia = interaction.options.getNumber("quantidade");
    if(quantia < 1) return interaction.reply({content:`${emoji(2)} | Coloque uma quantidade acima de \`1\``, ephemeral:true});
    if(quantia > prod.conta.length) return interaction.reply({content:`${emoji(12)} | Este Produto só tem apenas \`${prod.conta.length}\` de Estoque`, ephemeral:true});
    
    const a = db.get(`${id}.conta`);
    const removed = a.splice(0, Number(quantia));
    user.send({
        content:`${emoji(0)} | Entrega do produto: ${db.get(`${id}.nome`)} x${quantia} Unidade \n${removed.join("\n")}`,
    }).then(() => {
        db.set(`${id}.conta`, a);
        interaction.reply({
            content:"Produto enviado com sucesso"
        })
       }).catch((err) => {
        console.log(err)
        interaction.reply({
            content:"O usuario está com o privado bloqueado!"
        })
       })
}}
function emoji(id) {
    try {
        const emj = personalizar.get(`${id}`);
        return emj || "❌";
    } catch {
        return "❌"
    }
}