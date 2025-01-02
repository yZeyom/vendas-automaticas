const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType } = require("discord.js");
const {bot,carrinho,db,logs,pn,rd,vnd, token , personalizar, perm} = require("../../database/index");


module.exports = {
    name:"permlista",
    description:"[🛠|💰 Vendas Moderação] Veja todos os membros que possuem permissão de adm no bot",
    type: ApplicationCommandType.ChatInput,
    run: async( client, interaction ) => {
        if(interaction.user.id !== token.get(`owner`)) return await interaction.reply({content:"🔍 | Somente o dono do bot pode usar esse comando!", ephemeral:true});
        await interaction.reply({content:`🔁 | Aguarde um momento...`, ephemeral:true});
        try {
            const all = await perm.all();
        let msg = "";
        await all.map((user) =>{
            const member = interaction.client.users.cache.get(user.data);
            msg += `🔧 | ${member.username} - ${member.id} \n\n`
        });

        await interaction.editReply({
            embeds:[
                new EmbedBuilder()
                .setColor("Random")
                .setTitle(`Membro(s) com permissão - ${all.length}`)
                .setDescription(`${msg}`)
            ],
            ephemeral:true,
            content:""
        })
        } catch(err) {
            interaction.editReply({
                content:`⚠ | Ocorreu um erro\n\n${err.message}`
            })
        }

    }
}