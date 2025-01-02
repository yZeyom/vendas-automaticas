const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType, ModalBuilder, TextInputBuilder } = require("discord.js");
const {bot,carrinho,db,logs,pn,rd,vnd, token , personalizar, perm} = require("../../database/index");


module.exports = {
    name:"dm",
    description:"[🛠| Moderação] Envie uma mensagem no privado de um usuario.",
    type: ApplicationCommandType.ChatInput,
    options:[
        {
            name:"usuário",
            description:"Mencione um usuario.",
            type: ApplicationCommandOptionType.User,
            required:true,
        },
        {
            name:"mensagem",
            description:"Escreva algo pra ser enviado.",
            type: ApplicationCommandOptionType.String,
            required:true,
        }
    ],
  run:async (client,interaction) => {

    const user = interaction.options.getUser("usuário");
    const texto = interaction.options.getString("mensagem");

    if(!await perm.get(`${interaction.user.id}`)) return await interaction.reply({embeds:[ new EmbedBuilder().setDescription(`⚠️ | Você não possui permissão para utilizar este comando!`).setColor("Red")],ephemeral:true});
    await interaction.reply({content:`🔁 | Aguarde um momento...`, ephemeral:false});

    try {
        user.send({
            content: `${texto}`,
        })
        .then(() => {
            interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                    .setDescription(`Olá ${interaction.user}, a mensagem foi enviada para ${user} com sucesso!`)
                    .setColor("Green")
                ],
                content: ``
            })
        })
        .catch(() => { 
            interaction.editReply({ 
                embeds: [
                    new EmbedBuilder()
                    .setDescription(`❌ | Não foi possivel enviar a mensagem para o usuário: **${user}**, verifique se a DM do tal não esta trancada...`)
                    .setColor("Red")
                ],
                content: ``
            })
        })
    } catch (err) {
        interaction.editReply({content:`⚠️ | Ocorreu um erro para tentar enviar a mensagem... \nMensagem do erro: \`\`\` ${err.message} \`\`\``});

    }

  }
}