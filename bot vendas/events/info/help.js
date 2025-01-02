const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, ActivityType, StringSelectMenuBuilder, ChannelSelectMenuBuilder, ChannelType, RoleSelectMenuBuilder } = require("discord.js");
const {bot,carrinho,db,logs,pn,rd,vnd, token} = require("../../database/index"); 
let timer;

module.exports = {
    name:"interactionCreate", 
    run: async( interaction, client) => {

        const customId = interaction.customId; 
        if(!customId) return;
        const colorembed = await bot.get("cor");
        const userid = customId.split("_")[0];
        if(interaction.user.id !== userid) return;
        
    if(customId.endsWith("_cmdadm")) { resettime();

    interaction.update({
        embeds: [
            new EmbedBuilder()
            .setTitle(`${interaction.client.user.username} | Comandos do Bot`)
            .setColor(colorembed)
            .setDescription(`⚙️ **/botconfig**\n\`\`Configura o bot e os canais.\`\`\n\n⚙️ **/administrarsaldo**\n\`\`Administra o saldo de um usuário, podendo adicionar ou remover saldo.\`\`\n\n⚙️ **/criar**\n\`\`Cria um produto para venda.\`\`\n\n⚙️ **/config**\n\`\`Configura o produto selecionado.\`\`\n\n⚙️ **/criardrop**\n\`\`Cria um drop.\`\``)
            .addFields(
                { name: `⚙️ /gerarpix`, value: `\`\`Cria uma cobrança com o valor selecionado.\`\``},
                { name: `⚙️ /set`, value: `\`\`Seta a mensagem de compra do produto selecionado.\`\``},
                { name: `⚙️ /stockid`, value: `\`\`Mostra o estoque do produto selecionado.\`\``},
                { name: `⚙️ /del`, value: `\`\`Deleta o produto selecionado.\`\``},
                { name: `⚙️ /criarcupom`, value: `\`\`Cria um Cupom de Desconto.\`\``},
                { name: `⚙️ /personalizar`, value: `\`\`Personalize uma embed\`\``},
                { name: `⚙️ /rankadm`, value: `\`\`Mostra o rank de pessoas que mais compraram com o valor gasto.\`\``},
                { name: `⚙️ /rankprodutos`, value: `\`\`Mostra os produtos que mais geraram lucro.\`\``},
                { name: `⚙️ /reembolsar`, value: `\`\`Reembolsa de forma automática o pagamento selecionado.\`\``},
                { name: `⚙️ /resetar`, value: `\`\`Reseta as vendas, o rank, cupons, etc.\`\``},
                { name: `⚙️ /status`, value: `\`\`Verifica o Status da Compra selecionada.\`\``},
                { name: `⚙️ /conectar`, value: `\`\`Faz o bot entrar no canal de voz selecionado.\`\``},
                { name: `⚙️ /anunciar`, value: `\`\`Faz o bot enviar um anuncio.\`\``},
                { name: `⚙️ /say`, value: `\`\`Faz o bot falar.\`\``},
                { name: `⚙️ /dm`, value: `\`\`Faz o bot mandar uma mensagem no privado do membro selecionado.\`\``},
                { name: `⚙️ /configcupom`, value: `\`\`Configura o Cupom selecionado.\`\``},
                { name: `⚙️ /criargift`, value: `\`\`Cria um código que ao ser resgatado, o usuário ganhará o saldo selecionado.\`\``},
                { name: `⚙️ /criados`, value: `\`\`Mostra todos os produtos, cupons, keys, etc. cadastrados no bot.\`\``},
                { name: `⚙️ /criarkey \`@cargo\``, value: `\`\`Cria uma key, ao ser resgatada o usúario receberá o cargo selecionado.\`\``},
                { name: `⚙️ /delkey \`key\``, value: `\`\`Deleta uma key.\`\``},
                { name: `⚙️ /entregar`, value: `\`\`Entrega o produto selecionado para um usuário.\`\``},
                { name: `⚙️ /estatisticas`, value: `\`\`Mostra as estatisticas de vendas do bot.\`\``},
                { name: `⚙️ /permadd`, value: `\`\`Concede a permissão de usar o bot para um usuário.\`\``},
                { name: `⚙️ /permremove`, value: `\`\`Remove a permissão de um usuário\`\``},
                { name: `⚙️ /permlista`, value: `\`\`Ver todos os usuários que tem permissão\`\``},
            )
            .setFooter({ text: `Página 2/2`, iconURL: interaction.client.user.displayAvatarURL()})
        ],
        components: [
            new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId(`${interaction.user.id}_cmdlivre`)
                .setLabel("Comandos de Livre uso.")
                .setEmoji("<:config_cloud:1213558269633892352>")
                .setStyle(3)
            )
        ]
    })

}

if(customId.endsWith("_cmdlivre")) { resettime();

    interaction.update({
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
    })
}

function resettime() {
            
    if (timer) {
        clearTimeout(timer);
    }
    timer = setTimeout(() => {
        interaction.message.edit({
            content:"⚠️ | Use o Comando Novamente!",
            components:[],
            embeds:[],
            files:[]
        });
    }, 900000);
    }
    } 
}