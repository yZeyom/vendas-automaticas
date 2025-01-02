const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const {bot,carrinho,db,logs,pn,rd,vnd, token, perm} = require("../../database/index"); 

module.exports = {
    name:"personalizar",
    description:"[🛠|💰 Vendas Moderação] Personalize a embed",
    type: ApplicationCommandType.ChatInput,
    run: async(client, interaction) => { 
        if(!await perm.get(`${interaction.user.id}`)) return await interaction.reply({embeds:[ new EmbedBuilder().setDescription(`⚠️ | Você não possui permissão para utilizar este comando!`).setColor("Red")],ephemeral:true});
        interaction.reply({
            embeds:[
                new EmbedBuilder()
                .setTitle(`${interaction.client.user.username} | Personalizar`)
                .setDescription(`Clique no que você deseja personalizar:`)
            ],
            components:[
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId(`${interaction.user.id}_mensagemcompra`)
                    .setLabel("Mensagem de Compra")
                    .setEmoji("<:config_cloud:1213558269633892352>")
                    .setStyle(1),
                    new ButtonBuilder()
                    .setCustomId(`${interaction.user.id}_alteraremojis`)
                    .setLabel("Alterar Emojis Padrões")
                    .setEmoji("<:config_cloud:1213558269633892352>")
                    .setStyle(1),
                )
            ]
        }) 

        const filter = i => i.user.id === interaction.user.id;

        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            if(interaction.customId === `${interaction.user.id}_mensagemcompra`){}
            if(interaction.customId === `${interaction.user.id}_alteraremojis`){}
        });

        collector.on('end', collected => { 
            if (collected.size === 0) interaction.editReply({ content: '⚠️ | Use o Comando Novamente!', components: [], embeds:[] });
        });
    }}