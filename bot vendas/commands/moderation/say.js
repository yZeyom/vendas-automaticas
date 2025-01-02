const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType, ModalBuilder, TextInputBuilder } = require("discord.js");
const {bot,carrinho,db,logs,pn,rd,vnd, token , personalizar, perm} = require("../../database/index");


module.exports = {
    name:"say",
    description:"[🛠| Moderação] Faça eu falar",
    type: ApplicationCommandType.ChatInput,
    options:[
        {
            name:"texto",
            description:"Coloque o texto aqui.",
            type: ApplicationCommandOptionType.String,
            required:true,
        }
    ],
  run:async (client,interaction) => {
    const texto = interaction.options.getString("texto");
    if(!await perm.get(`${interaction.user.id}`)) return await interaction.reply({embeds:[ new EmbedBuilder().setDescription(`⚠️ | Você não possui permissão para utilizar este comando!`).setColor("Red")],ephemeral:true});
    await interaction.reply({content:`🔁 | Aguarde um momento...`, ephemeral:true});

    try {
        await interaction.channel.send({content:`${texto}`})
    } catch (err) {
        interaction.editReply({content:`⚠️ | Ocorreu um erro para tentar enviar a mensagem...`});
    } finally {
        interaction.editReply({content:`⚠️ | Mensagem enviada!`});
    }



}}