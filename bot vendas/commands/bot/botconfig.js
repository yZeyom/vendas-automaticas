const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const {bot,carrinho,db,logs,pn,rd,vnd, token, personalizar} = require("../../database/index"); 

module.exports = {
    name:"botconfig",
    description:"[🛠|💰 Vendas Moderação] Configure o bot",
    type: ApplicationCommandType.ChatInput,
    run: async(client, interaction) => {

        if(interaction.user.id !== token.get(`owner`)) return interaction.reply({content:"🔍 | Somente o dono do bot pode usar esse comando!", ephemeral:true})
        await interaction.reply({
            content:`🔁 | Carregando...`,
        });


        const vend = await vnd.get(`vendas`);

        interaction.editReply({
            content:``,
            embeds:[
                new EmbedBuilder()
                .setThumbnail(interaction.client.user.displayAvatarURL())
                .setAuthor({name:`${interaction.client.user.username}`, iconURL:interaction.client.user.displayAvatarURL()})
                .setTitle(`${emoji(5)} **| Painel de Configuração do bot**`)
                .setDescription(`${emoji(5)} | Sistema de Vendas: ${vend === true ? "ON" : "OFF"}\n\n**Use os botões abaixo para configurar seu bot:**\n[Link Para Add o Bot](https://discord.com/api/oauth2/authorize?client_id=${interaction.client.user.id}&permissions=8&scope=bot%20applications.commands)`)
            ],
            components:[
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId(`${interaction.user.id}_vendasonoff`)
                    .setLabel("Vendas On/Off")
                    .setStyle(vend === true ? 3 : 4)
                    .setEmoji("<:config_cloud:1213558269633892352>"),
                    new ButtonBuilder()
                    .setCustomId(`${interaction.user.id}_configpag`)
                    .setLabel("Configurar Pagamento")
                    .setStyle(1)
                    .setEmoji("<:Contrato_cloud:1221874795088445490>"),
                    new ButtonBuilder()
                    .setCustomId(`${interaction.user.id}_configbot`)
                    .setLabel("Configurar Bot")
                    .setStyle(1)
                    .setEmoji("<a:planeta_cloud:1221858904015765524>"),
                    new ButtonBuilder()
                    .setCustomId(`${interaction.user.id}_configchannel`)
                    .setLabel("Configurar Canais")
                    .setStyle(1)
                    .setEmoji("<:engrenagem_cloud:1213652588571004959>"),
                    new ButtonBuilder()
                    .setCustomId(`${interaction.user.id}_configterms`)
                    .setLabel("Configurar os Termos de compra")
                    .setStyle(1)
                    .setEmoji("<:folha_cloud:1221870992817782936>"),
                ),
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId(`${interaction.user.id}_buttonconfigduvida`)
                    .setLabel("Botão Dúvidas")
                    .setEmoji("<:click_cloud:1213554785366835230>")
                    .setStyle(1),
                    new ButtonBuilder()
                    .setCustomId(`${interaction.user.id}_configmod123`)
                    .setLabel("Configurar Moderação")
                    .setEmoji("<:escudo_cloud:1213554942061711410>")
                    .setStyle(1)
                )
            ]
        });

        const filter = i => i.user.id === interaction.user.id;

        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            if(interaction.customId === `${interaction.user.id}_vendasonoff`){}
            if(interaction.customId === `${interaction.user.id}_configpag`){}
            if(interaction.customId === `${interaction.user.id}_configbot`){}
            if(interaction.customId === `${interaction.user.id}_configchannel`){}
            if(interaction.customId === `${interaction.user.id}_configterms`){}
        });
        collector.on('end', collected => { 
            if (collected.size === 0) interaction.editReply({ content: '⚠️ | Use o Comando Novamente!', components: [], embeds:[] });
        });

    }
}

function emoji(id) {
    try {
        const emj = personalizar.get(`${id}`);
        return emj || "❌";
    } catch {
        return "❌"
    }
}