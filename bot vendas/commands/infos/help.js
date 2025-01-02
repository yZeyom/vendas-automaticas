const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, Embed } = require("discord.js");
const {bot,carrinho,db,logs,pn,rd,vnd, token} = require("../../database/index"); 

module.exports = {
    name:"help",
    description:"[🛠| Informações] Exibe todos os meus comandos.",
    type: ApplicationCommandType.ChatInput,
    run: async(client, interaction) => {

        const colorembed = await bot.get("cor");

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle(`${interaction.client.user.username} | Comandos Liberados Para todos os Usuários`)
                .setColor(colorembed)
                .addFields(
                    { name: `⚙️ /help`, value: `\`\`Exibe essa mensagem.\`\``},
                    { name: `⚙️ /perfil`, value: `\`\`Mostra o perfil de quem enviou o comando.\`\``},
                    { name: `⚙️ /rank`, value: `\`\`Mostra o rank de pessoas que mais compraram.\`\``},
                    { name: `⚙️ /adicionarsaldo`, value: `\`\`Adiciona saldo via pix.\`\``},
                    { name: `⚙️ /ativarkey`, value: `\`\`Resgata uma key.\`\``},
                    { name: `⚙️ /resgatargift`, value: `\`\`Resgata um gift.\`\``},
                    { name: `⚙️ /pegardrop \`CÓDIGO\``, value: `\`\`Pega um drop.\`\``},
                    { name: `⚙️ /cleardm`, value: `\`\`Apagar as mensagens do bot da sua dm.\`\``},
                    { name: `⚙️ /info \`ID DA COMPRA\``, value: `\`\`Mostra informações da compra que você colocou o ID.(Liberado apenas para quem comprou e para os Adm)\`\``},
                    { name: `⚙️ /pegar \`ID DA COMPRA\``, value: `\`\`Mostra o Produto que foi Entregue da compra que você colocou o ID.(Liberado apenas para quem comprou e para os Adm)\`\``},
                )
                .setFooter({ text: `Página 1/2`, iconURL: interaction.client.user.displayAvatarURL()})
            ],
            components: [
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId(`${interaction.user.id}_cmdadm`)
                    .setLabel("Comandos Adm")
                    .setEmoji("<:engrenagem_cloud:1213652588571004959>")
                    .setStyle(1)
                )
            ]
        });

        
        const filter = i => i.user.id === interaction.user.id;

        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 900000 });

        collector.on('collect', async i => {
            if(interaction.customId === `${interaction.user.id}_cmdadm`){} 
        });
        collector.on('end', collected => { 
            if (collected.size === 0) interaction.editReply({ content: '⚠️ | Use o Comando Novamente!', components: [], embeds:[] });
        });

    }
}