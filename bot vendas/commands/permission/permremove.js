const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType } = require("discord.js");
const {bot,carrinho,db,logs,pn,rd,vnd, token , personalizar, perm} = require("../../database/index");


module.exports = {
    name:"permremove",
    description:"[🛠|💰 Vendas Moderação] Remover permissão a um usúario para gerenciar o sistema de vendas",
    type: ApplicationCommandType.ChatInput,
    options:[
        {
            name:"user",
            description:"Mencione o usuário que queira remover a permissão.",
            type: ApplicationCommandOptionType.User,
            required:true
        }
    ],
    run: async(client,interaction) => {
    try {
        const user = interaction.options.getUser("user")
        if(interaction.user.id !== token.get(`owner`)) return interaction.reply({content:"🔍 | Somente o dono do bot pode usar esse comando!", ephemeral:true});
    if(!await perm.get(`${user.id}`)) return interaction.reply({content:`🔍 | Esse Membro não tem permissão!`, ephemeral:true});
    await perm.delete(`${user.id}`);
    await interaction.reply({
        embeds:[
            new EmbedBuilder()
            .setDescription(`✅ | Foi Removida permissão para o membro ${user} com sucesso.`)
            .setColor("Green")
        ],
        ephemeral:true,
    });
    } catch {
        interaction.channel.send({content:`Ocorreu um erro, tente novamente`, ephemeral:true});
    }

}}
