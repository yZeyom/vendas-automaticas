const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType, ModalBuilder, TextInputBuilder, ChannelType} = require("discord.js");
const {bot,carrinho,db,logs,pn,rd,vnd, token , personalizar, perm} = require("../../database/index");
const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
    name: "conectar",
    description: "[🛠|💰 Vendas Moderação] Faz o bot entrar em um canal de voz",
    options: [
        {
            name: "canal",
            description: "Coloque o canal de voz aqui.",
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [
                ChannelType.GuildVoice,
            ],
            required: true
        }
    ],
    run: async (client, interaction) => { 
        if(!await perm.get(`${interaction.user.id}`)) return await interaction.reply({embeds:[ new EmbedBuilder().setDescription(`⚠️ | Você não possui permissão para utilizar este comando!`).setColor("Red")],ephemeral:true});
        const canal = interaction.options.getChannel('canal'); 
        const colorembed = bot.get(`cor`)

        joinVoiceChannel({
            channelId: canal.id,
            guildId: canal.guild.id,
            adapterCreator: canal.guild.voiceAdapterCreator
        })

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setAuthor({ name: `${interaction.client.user.username}`, iconURL: `${interaction.client.user.displayAvatarURL()}`})
                .setColor(colorembed)
                .setDescription(`${personalizar.get("11")} **| ${interaction.user.username}, entrei no canal de voz: ${canal} com sucesso!**`)
                .setThumbnail(`${interaction.client.user.displayAvatarURL()}`)
                .setFooter({ text: `${interaction.client.user.username} - Todos os direitos reservados.`, iconURL: `${interaction.client.user.displayAvatarURL()}`})
            ],
            ephemeral: true 
        })
    }
}