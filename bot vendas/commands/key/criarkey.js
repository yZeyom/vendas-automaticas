const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType, ModalBuilder, TextInputBuilder, ChannelType} = require("discord.js");
const {bot,carrinho,db,logs,pn,rd,vnd, token , personalizar, perm, key} = require("../../database/index");
module.exports = {
    name: "criarkey",
    description: "[🛠|💰 Vendas Moderação] Cria uma key para o cargo selecionado",
    options: [
        {
            name: "cargo",
            description: "Selecione um cargo.",
            type: ApplicationCommandOptionType.Role,
            required: true
        }
    ],
    run: async (client, interaction) => { 
        if(!await perm.get(`${interaction.user.id}`)) return await interaction.reply({embeds:[ new EmbedBuilder().setDescription(`⚠️ | Você não possui permissão para utilizar este comando!`).setColor("Red")],ephemeral:true});
        const role = interaction.options.getRole("cargo");
        await interaction.member.roles.add(role.id)
        .then(() => {
            const code = codigo();
            interaction.user.send({
                embeds:[
                    new EmbedBuilder()
                    .setColor(bot.get("cor"))
                    .setTitle("Chave Criada!")
                    .setDescription(`Você acabou de gerar uma chave para o cargo ${role.name}\n**Lembre-se de deixar o cargo do bot em cima desse cargo**`)
                    .setThumbnail(interaction.client.user.displayAvatarURL())
                    .addFields(
                        {
                            name:"🔑 | Chave",
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
                        .setTitle("Chave gerada com sucesso.")
                        .setDescription(`Olhe a DM para ver a chave.`)
                        .setColor(bot.get("cor"))
                        .setThumbnail(interaction.client.user.displayAvatarURL())
                        .setFooter({iconURL: interaction.client.user.displayAvatarURL(), text: `${interaction.guild.name} - Todos os direitos reservados.`})
                        .setTimestamp()
                    ]
                });
                key.set(`${code}`, role.id);
            }).catch(() => {
                embeds:[
                    new EmbedBuilder()
                    .setTitle("calma, um momento.")
                    .setDescription(`${interaction.user}, você precisa liberar a DM para poder enviar a mensagem.`)
                    .setFooter({text:`${interaction.guild.name} - Todos os direitos reservados.`, iconURL: interaction.client.user.displayAvatarURL()})
                    .setThumbnail(interaction.client.user.displayAvatarURL())
                ]
            })
        })
        .catch(() => {
            interaction.reply({content:`${emoji(2)} | O cargo selecionado é superior ao meu!`, ephemeral:true});
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