const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType, ModalBuilder, TextInputBuilder } = require("discord.js");
const {bot,carrinho,db,logs,pn,rd,vnd, token , personalizar, perm, cupom} = require("../../database/index");


module.exports = {
    name:"criarcupom",
    description:"[🛠|💰 Vendas Moderação] Crie um Cupom de Desconto",
    type: ApplicationCommandType.ChatInput,
    options:[
        {
            name:"nome",
            description:"Coloque o nome do novo cupom aqui!",
            type: ApplicationCommandOptionType.String,
            required:true
        },
        {
            name:"porcentagem",
            description:"Coloque a porcentagem do desconto aqui!",
            type: ApplicationCommandOptionType.Number,
            required:true
        },
        {
            name:"valorminimo",
            description:"Coloque o valor mínimo para que esse cupom possa ser utilizado!", 
            type: ApplicationCommandOptionType.Number,
            required:true
        },
        {
            name:"quantidade",
            description:"Coloque a quantidade de usos do cupom aqui!",
            type: ApplicationCommandOptionType.Number,
            required:true
        },
        {
            name:"cargo",
            description:"Limitar o uso deste cupom á um só cargo.",
            type: ApplicationCommandOptionType.Role,
            required:false
        },
    ],
    run:async(client, interaction) => {
        if(!await perm.get(`${interaction.user.id}`)) return await interaction.reply({embeds:[ new EmbedBuilder().setDescription(`⚠️ | Você não possui permissão para utilizar este comando!`).setColor("Red")],ephemeral:true});
        const name = interaction.options.getString("nome");
        const porcentagem = interaction.options.getNumber("porcentagem");
        const valorminimo = interaction.options.getNumber("valorminimo");
        const quantidade = interaction.options.getNumber("quantidade");
        const cargo = interaction.options.getRole("cargo");
        const a = await cupom.get(name);
        if(a) return interaction.reply({content:`${emoji(29)} | Já existe um Cupom com esse Nome`, ephemeral:true});
        if(porcentagem < 0 || porcentagem > 100) return interaction.reply({content:`${emoji(29)} | Coloque uma porcentagem Acima de 0 ou abaixo de 100`, ephemeral:true});
        if(valorminimo < -1) return interaction.reply({content:`${emoji(29)} | Coloque o Valor minimo 0 ou Acima`, ephemeral:true});
        if(name.includes("_")) return interaction.reply({content:`${personalizar.get("29")} | Não Coloque anderlaine(_)!`, ephemeral:true})
        await cupom.set(`${name}`, {
            porcentagem,
            valorminimo,
            quantidade,
            cargo: `${cargo?.id ?? "Não Definido"}`
        });
        interaction.reply({
            embeds:[
                new EmbedBuilder()
                .setTitle(`${interaction.guild.name} | Sistema de Cupom`)
                .setDescription(`${emoji(11)} | Cupom criado com sucesso! use \`/configcupom ${name}\`, para configura-lo`)
                .setColor(await bot.get("cor"))
            ],
            ephemeral:true
        })
}}


function emoji(id) {
    try {
        const emj = personalizar.get(`${id}`);
        return emj || "❌";
    } catch {
        return "❌"
    }
}