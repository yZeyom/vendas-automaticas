const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, Embed } = require("discord.js");
const {bot,carrinho,db,logs,pn,rd,vnd, token, personalizar} = require("../../database/index"); 

module.exports = {
    name:"cleardm",
    description:"[🛠| Utilidades] Limpe todas as mensagens do bot na sua DM|",
    type: ApplicationCommandType.ChatInput,
    run: async(client, interaction) => {

        const colorembed = await bot.get("cor");

        const DM = await interaction.user.createDM();

        const lastMessage = await DM.messages.fetch({ limit: 1 });
        if (lastMessage.size == 0) {
            await interaction.reply({
                content: `${emoji(2)} | Nenhuma mensagem encontrada!`,
                ephemeral: true
            });
            return;
        };

        await interaction.reply({
            content: `${emoji(11)} **| ${interaction.user.username} Ok, irei limpar sua dm!**`,
            ephemeral: true
        });

        
        const messagesToDelete = await DM.messages.fetch({ limit: 100 });

        let deletedCount = 0; 
        for (const message of messagesToDelete.values()) {
            if (message.author.bot) {
                await message.delete().catch(console.error);
                deletedCount++;
            };
            await interaction.editReply({
                content: `${emoji(11)} | Total de mensagens apagadas: ${deletedCount}`,
                ephemeral: true
            });
        };

    }
}

function emoji(id) {
    try {
        const emj = personalizar.get(`${id}`);
        return emj || "❌";
    } catch {
        return "❌"
    }
}