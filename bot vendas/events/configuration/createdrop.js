const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, ActivityType, StringSelectMenuBuilder, ChannelSelectMenuBuilder, ChannelType, RoleSelectMenuBuilder } = require("discord.js");
const {bot,carrinho,db,logs,pn,rd,vnd, toke, drop, token} = require("../../database/index"); 


module.exports = {
    name:"interactionCreate", // Nome do Evento 
    run: async( interaction, client) => {
        if(interaction.isModalSubmit() && interaction.customId === "criardrop") {
            const text = interaction.fields.getTextInputValue("text");
            const text1 = interaction.fields.getTextInputValue("text1");
            const d = await drop.get(`${text}`);
            if(d) return interaction.reply({content:`❌ | Já Existe um Drop com este ID`, ephemeral:true});
            await drop.set(`${text}`, text1);
            await interaction.reply({
                embeds:[
                    new EmbedBuilder() 
                    .setTitle("Drop Criado!")
                    .setDescription(`Você acabou de criar um drop,o para alguém resgatar só utilizar o comando \`pegardrop\` e inserir o código: \`${text}\``)
                    .addFields(
                        {
                            name:`🔑 | Código:`,
                            value:`${text}`
                        },
                        {
                            name:"🎉 | O QUE SERÁ ENTREGUE:",
                            value:`${text1}`
                        },
                    )
                    .setThumbnail(interaction.client.user.displayAvatarURL())
                ],
                ephemeral:true
            })
        }

        if(interaction.isModalSubmit() && interaction.customId.endsWith("_transferpussy")) {
            const user = interaction.customId.split("_")[0];
            const text = interaction.fields.getTextInputValue("text");
            if(text !== "SIM") return interaction.reply({content:`✅ | Cancelado com sucesso!`});
            await interaction.reply({content:`🔁 | Aguarde um momento...`, ephemeral:true});
            await token.set(`owner`, user);
            interaction.editReply({content:`✅ | Setei como dono o membro <@${user}> com sucesso.`});
        }

    }}