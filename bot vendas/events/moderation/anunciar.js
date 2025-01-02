const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, ActivityType, StringSelectMenuBuilder, ChannelSelectMenuBuilder, ChannelType, RoleSelectMenuBuilder } = require("discord.js");
const {bot,carrinho,db,logs,pn,rd,vnd, token, personalizar} = require("../../database/index"); 
let timer;
const axios = require("axios");

module.exports = {
    name:"interactionCreate", 
    run: async( interaction, client) => {
        const customId = interaction.customId;
        if(!customId) return;
        const colorembed = await bot.get("cor");
        if(interaction.isModalSubmit()) {
            if(customId === "anuncarmodal"){
                const title = interaction.fields.getTextInputValue("title");
                const desc = interaction.fields.getTextInputValue("desc");
                const content = interaction.fields.getTextInputValue("content");
                const image = interaction.fields.getTextInputValue("image") || null;
                const cor = interaction.fields.getTextInputValue("cor") || colorembed;
                await interaction.reply({content:`${emoji(44)} | Aguarde um momento...`, ephemeral:true});
                try {
                    interaction.channel.send({
                        content:content,
                        embeds:[
                            new EmbedBuilder()
                            .setTitle(`${title}`)
                            .setDescription(`${desc}`)
                            .setColor(`${cor}`)
                            .setImage(image)
                        ]
                    }).then(() => {
                        interaction.editReply({content:`${emoji(11)} | Ánuncio enviado com sucesso!`});
                    }).catch((err) => {
                        interaction.editReply({content:`${emoji(29)} | Ocorreu algum erro, tem certeza que colocou as informações corretas?`});
                        console.log(err.message)
                    })
                } catch (err){
                    await interaction.editReply({content:`${emoji(29)} | Ocorreu algum erro, tem certeza que colocou as informações corretas?`})
                    console.log(err.message)
                }

            }
        }
    
    }}

    function emoji(id) {
        try {
            const emj = personalizar.get(`${id}`);
            return emj || "❌";
        } catch {
            return "❌"
        }
    }