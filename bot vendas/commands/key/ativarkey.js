const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType, ModalBuilder, TextInputBuilder, ChannelType} = require("discord.js");
const {bot,carrinho,db,logs,pn,rd,vnd, token , personalizar, perm, key} = require("../../database/index");
module.exports = {
    name: "ativarkey",
    description: "[💰 Vendas Utilizadades] Ative uma key",
    options: [
        {
            name: "key",
            description: "Coloque sua Key Aqui!",
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    run: async (client, interaction) => { 
        const key1 = interaction.options.getString("key");
        const roleid = await key.get(`${key1}`);
        if(!roleid) return interaction.reply({content:`${emoji(12)} | Essa Key não existe`, ephemeral:true});
        interaction.member.roles.add(roleid);
        interaction.reply({
            embeds:[
                new EmbedBuilder()
                .setColor(await bot.get("cor"))
                .setTitle("Key ativada com sucesso.")
                .setDescription(`Você acabou de ativar a key para o cargo <@&${roleid}>, Aproveite!`)
                .setFooter({text:`${interaction.guild.name} - Todos os direitos reservados`, iconURL: interaction.client.user.displayAvatarURL()})
                .setThumbnail(interaction.client.user.displayAvatarURL())
                .setTimestamp()
            ],
            ephemeral:true
        });
        await key.delete(`${key1}`);
        const channel = await interaction.guild.channels.cache.get(await vnd.get("logs_adm"));
        if(channel) {
            channel.send({
                embeds:[
                    new EmbedBuilder()
                    .setColor(await bot.get("cor"))
                    .setTitle("Ativação de Key")
                    .setDescription(`O ${interaction.user} acabou de ativar a key para o cargo <@&${roleid}>`)
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