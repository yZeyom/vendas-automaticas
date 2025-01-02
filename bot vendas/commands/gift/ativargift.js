const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType, ModalBuilder, TextInputBuilder, ChannelType} = require("discord.js");
const {bot,carrinho,db,logs,pn,rd,vnd, token , personalizar, perm, key, gift, saldo} = require("../../database/index");
module.exports = {
    name: "resgatargift",
    description: "[💰 Vendas Utilizadades] Resgate um gift",
    options: [
        {
            name: "código",
            description: "Coloque o código do gift aqui!",
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    run: async (client, interaction) => { 
        const key1 = interaction.options.getString("código");
        const gi = await gift.get(`${key1}`);
        if(!gi) return interaction.reply({content:`${emoji(12)} | Esse gift não existe`, ephemeral:true});
        const saldoa = await saldo.get(`${interaction.user.id}.saldo`);
        interaction.reply({
            embeds:[
                new EmbedBuilder()
                .setColor(await bot.get("cor"))
                .setTitle("Gift resgatado com sucesso.")
                .setDescription(`Você acabou de resgatar um gift no valor de: \`R$${Number(gi).toFixed(2)}\`, agora você está com \`R$${Math.floor(gi + saldoa).toFixed(2)}\``)
                .setFooter({text:`${interaction.guild.name} - Todos os direitos reservados`, iconURL: interaction.client.user.displayAvatarURL()})
                .setThumbnail(interaction.client.user.displayAvatarURL())
                .setTimestamp()
            ],
            ephemeral:true
        });
        await saldo.add(`${interaction.user.id}.saldo`, Number(gi).toFixed(2));
        await gift.delete(`${key1}`);
        const channel = await interaction.guild.channels.cache.get(await vnd.get("logs_adm"));
        if(channel) {
            channel.send({
                embeds:[
                    new EmbedBuilder()
                    .setColor(await bot.get("cor"))
                    .setTitle("Reivindicação de gift")
                    .setDescription(`O ${interaction.user} acabou de resgatar um gift no valor de \`R$${Number(gi).toFixed(2)}\`, e agora ele está com \`${Math.floor(gi + saldoa).toFixed(2)}\``)
                    .setFooter({text:`${interaction.user.username} - ${interaction.user.id}`, iconURL: interaction.member.displayAvatarURL()})
                    .setThumbnail(interaction.member.displayAvatarURL())
                    .setTimestamp() 
                ]
            })
        }

}};

function emoji(id) {
    try {
        const emj = personalizar.get(`${id}`);
        return emj || "❌";
    } catch {
        return "❌"
    }
}