const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType, ModalBuilder, TextInputBuilder } = require("discord.js");
const {bot,carrinho,db,logs,pn,rd,vnd, token , personalizar, perm, drop} = require("../../database/index");


module.exports = {
    name:"pegardrop",
    description:"[🧀|💰 Vendas Utilidades] Pegar um Drop",
    type: ApplicationCommandType.ChatInput,
    options:[
        {
            name:"codigo",
            description:"Coloque o Codigo aqui!",
            type: ApplicationCommandOptionType.String,
            required:true
        }
    ],
    run:async(client, interaction) => {
        const id = interaction.options.getString("codigo");
        const codigo = await drop.get(`${id}`);
        if(!codigo) return interaction.reply({content:`🔍 | esse código não existe!`});
        interaction.reply({
            embeds:[
                new EmbedBuilder()
                .setColor(await bot.get("cor"))
                .setThumbnail(interaction.client.user.displayAvatarURL())
                .setTitle("Drop resgatado com sucesso!")
                .addFields( 
                    {
                        name:"🔑 | Código:",
                        value:`${id}`
                    },
                    {
                        name:"🎉 | Item Resgatado:",
                        value:`${codigo}`
                    },
                )
            ],
            ephemeral:true
        })
    }}