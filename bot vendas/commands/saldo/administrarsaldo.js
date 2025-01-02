const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType, ModalBuilder, TextInputBuilder, StringSelectMenuBuilder } = require("discord.js");
const {bot,carrinho,db,logs,pn,rd,vnd, token , personalizar, perm, saldo} = require("../../database/index");


module.exports = {
    name:"administrarsaldo",
    description:"[🛠|💰 Vendas Moderação] Gerenciar Saldo",
    type: ApplicationCommandType.ChatInput,
    options:[
        {
            name:"ação",
            description:"Adicionar ou Remover?",
            type: ApplicationCommandOptionType.String,
            required:true,
            choices:[
                {name:"Adicionar", value:"add"},
                {name:"Remover", value:"remove"},
            ]
        },
        {
            name:"user",
            description:"Mencione o usuário para gerenciar seu saldo",
            type: ApplicationCommandOptionType.User,
            required:true,
        },
        {
            name:"valor",
            description:"Valor para remover ou adicionar ao usuário selecionado.",
            type: ApplicationCommandOptionType.Number,
            required:true
        }
    ],
    run:async(client, interaction) => {
        const db = saldo;
        if(!await perm.get(`${interaction.user.id}`)) return await interaction.reply({embeds:[ new EmbedBuilder().setDescription(`⚠️ | Você não possui permissão para utilizar este comando!`).setColor("Red")],ephemeral:true});
        const acao = interaction.options.getString("ação");
        const user = interaction.options.getUser("user");
        const valor = interaction.options.getNumber("valor");
        const colorembed = await bot.get("cor");
        const saldoan = await db.get(`${user.id}.saldo`) || 0;
        if(acao === "add") {
            if(valor <= 0) return interaction.reply({content:`${emoji(29)} | Coloque Valores acima 0`, ephemeral:true});
            await interaction.reply({content:`${emoji(44)} | Aguarde um momento...`, });
            await db.add(`${user.id}.saldo`, Number(valor));
            interaction.editReply({
                content:"",
                embeds:[
                    new EmbedBuilder()
                    .setColor(colorembed)
                    .setTitle(`Saldo adicionado para ${user.username}`)
                    .setDescription(`O ${user} tinha \`R$${saldoan}\`, foi adicionado \`R$${valor}\`, agora ele está com \`R$${Math.floor(saldoan + valor)}\``)
                    .setThumbnail(user.displayAvatarURL())
                    .setFooter({text:`Autor: ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL()})
                    .setTimestamp()
                ]
            })
        } else {
            if(valor <= 0) return interaction.reply({content:`${emoji(29)} | Coloque Valores acima 0`, ephemeral:true});
            if(valor > saldoan) return interaction.reply({content:`${emoji(12)} | O ${user}, tem atualmente \`${saldoan}\`, não é possível retirar saldo deste usuário!`, ephemeral:true});
            await interaction.reply({content:`${emoji(44)} | Aguarde um momento...`, });
            await db.substr(`${user.id}.saldo`, Number(valor));
            interaction.editReply({
                content:"",
                embeds:[
                    new EmbedBuilder()
                    .setColor(colorembed)
                    .setTitle(`Saldo Retirado para ${user.username}`)
                    .setDescription(`O ${user} tinha \`R$${saldoan}\`, foi retirado \`R$${valor}\`, agora ele está com \`R$${Math.floor(saldoan + valor)}\``)
                    .setThumbnail(user.displayAvatarURL())
                    .setFooter({text:`Autor: ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL()})
                    .setTimestamp()
                ]
            })
        }
}}
function emoji(id) {
    try {
        const emj = personalizar.get(`${id}`);
        return emj || "❌";
    } catch {
        return "❌"
    }
}
