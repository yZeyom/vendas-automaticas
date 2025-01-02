const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType, ModalBuilder, TextInputBuilder, ChannelType} = require("discord.js");
const {bot,carrinho,db,logs,pn,rd,vnd, token , personalizar, perm, key, gift} = require("../../database/index");
module.exports = {
    name: "criargift",
    description: "[🛠|💰 Vendas Moderação] Cria um giftcard no valor escolhido",
    options: [
        {
            name: "valor",
            description: "Valor para ser resgatado.",
            type: ApplicationCommandOptionType.Number,
            required: true
        }
    ],
    run: async (client, interaction) => { 
        if(!await perm.get(`${interaction.user.id}`)) return await interaction.reply({embeds:[ new EmbedBuilder().setDescription(`⚠️ | Você não possui permissão para utilizar este comando!`).setColor("Red")],ephemeral:true});
        const role = interaction.options.getNumber("valor");

            const code = codigo();
            interaction.user.send({
                embeds:[
                    new EmbedBuilder()
                    .setColor(bot.get("cor"))
                    .setTitle("Gift Criado!")
                    .setDescription(`Você acabou de gerar um gift no valor de R$${role}`)
                    .setThumbnail(interaction.client.user.displayAvatarURL())
                    .addFields(
                        {
                            name:"🔑 | Código",
                            value:`${code}`
                        }
                    )
                    .setFooter({text:`${interaction.guild.name} - Todos os direitos reservados.`, iconURL: interaction.client.user.displayAvatarURL()})
                    .setTimestamp()
                ]
            }).then(() => {
                interaction.user.send({content:`${code}`})
                interaction.reply({
                    embeds:[
                        new EmbedBuilder()
                        .setTitle("Gift criado com sucesso.")
                        .setDescription(`Olhe a DM para ver o código do gift.`)
                        .setColor(bot.get("cor"))
                        .setThumbnail(interaction.client.user.displayAvatarURL())
                        .setFooter({iconURL: interaction.client.user.displayAvatarURL(), text: `${interaction.guild.name} - Todos os direitos reservados.`})
                        .setTimestamp()
                    ]
                });
                gift.set(`${code}`, Number(role).toFixed(2));
            }).catch(() => {
                embeds:[
                    new EmbedBuilder()
                    .setTitle("calma, um momento.")
                    .setDescription(`${interaction.user}, você precisa liberar a DM para poder enviar a mensagem.`)
                    .setFooter({text:`${interaction.guild.name} - Todos os direitos reservados.`, iconURL: interaction.client.user.displayAvatarURL()})
                    .setThumbnail(interaction.client.user.displayAvatarURL())
                ]
            })
    }}
    function codigo() {
        var gerados = "";
        var codigos = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
         for (var i = 0; i < 23; i++)
           gerados += codigos.charAt(Math.floor(Math.random() * codigos.length));
         return gerados;
       }

    function emoji(id) {
        try {
            const emj = personalizar.get(`${id}`);
            return emj || "❌";
        } catch {
            return "❌"
        }
    }