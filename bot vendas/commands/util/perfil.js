const { ApplicationCommandOptionType, ApplicationCommandType, EmbedBuilder } = require("discord.js");
const {saldo, bot} = require("../../database/index");



module.exports = {
    name:"perfil",
    description:"[🧀|💰 Vendas Utilidades] Veja o seu perfil ou o perfil de algum usuário",
    type: ApplicationCommandType.ChatInput,
    options:[
        {
            name:"user",
            description:"Mencione o usuário que você queira ver o perfil.",
            required:false,
            type: ApplicationCommandOptionType.User
        }
    ],
    run: async(client, interaction) => {
        const user = interaction.options.getUser("user") || interaction.user;
        let rank = "";
        const b = await saldo.all().sort((a, b) => b.data.gasto - a.data.gasto);
        
        if(b.filter(a => a.ID === user.id && a.data.gasto > 0).length > 0) {
            b.map((a, index) => {
                if(a.ID === user.id) {
                    rank = `${index + 1}`;
                } 
            })
        } else {
            rank = `${user.username} não está no rank!`;
        }
        const produtoscomprados = await saldo.get(`${user.id}.compras`) || 0;
        const gastos = Number(await saldo.get(`${user.id}.gasto`)).toFixed(2) || 0.00;
        const sald = Number(await saldo.get(`${user.id}.saldo`)).toFixed(2);

        const member = interaction.guild.members.cache.get(user.id);
        interaction.reply({
            embeds:[
                new EmbedBuilder()
                .setColor(await bot.get("cor"))
                .setAuthor({name:`${user.username}`, iconURL: member.displayAvatarURL()})
                .setTitle("Perfil")
                .addFields(
                    {
                        name:"Valor total gasto",
                        value:`\`R$ ${gastos}\``,
                        inline:true
                    },
                    {
                        name:`Pedidos aprovados`,
                        value:`\`${produtoscomprados}\``,
                        inline:true
                    },
                    {
                        name:"Posição no rank",
                        value:`\`${rank}°\``,
                        inline:true
                    },
                    {
                        name:"Primeira Compra",
                        value:`${await saldo.get(`${user.id}.primeiracompra`) ? `<t:${Math.floor(await saldo.get(`${user.id}.primeiracompra`) / 1000)}:R>` : `\`${user.username} não Compro nada.\``}`,
                        inline:true,
                    },
                    {
                        name:"Última Compra",
                        value:`${await saldo.get(`${user.id}.ultimacompra`) ? `<t:${Math.floor(await saldo.get(`${user.id}.ultimacompra`) / 1000)}:R>` : `\`${user.username} não Compro nada.\``}`,
                        inline:true,
                    },
                )
                .setFooter({text:`${interaction.guild.name}`, iconURL: interaction.guild.iconURL()})
                .setTimestamp()
            ]
        })
    }
}