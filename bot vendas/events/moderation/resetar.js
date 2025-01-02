const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, ActivityType, StringSelectMenuBuilder, ChannelSelectMenuBuilder, ChannelType, RoleSelectMenuBuilder } = require("discord.js");
const {bot,carrinho,db,logs,pn,rd,vnd, toke, drop, token, cupom, personalizar, saldo, gift, key} = require("../../database/index"); 


module.exports = {
    name:"interactionCreate", // Nome do Evento 
    run: async( interaction, client) => {
        const customId = interaction.customId;
        if(!customId) return;
        const userid = customId.split("_")[0];

        if(interaction.user.id !== userid) return;

        if(customId.endsWith("_cupons")) {

            const modal = new ModalBuilder()
            .setTitle("⚙ | Confirmar")
            .setCustomId(`${userid}_modalresetcupom`);

            const text = new TextInputBuilder()
            .setStyle(1)
            .setLabel(`para continuar escreva "SIM"`)
            .setRequired(true)
            .setPlaceholder("SIM")
            .setCustomId("text")
            .setMaxLength(10);

            modal.addComponents(new ActionRowBuilder().addComponents(text));

            return interaction.showModal(modal);
        }
        if(interaction.isModalSubmit() && interaction.customId.endsWith("_modalresetcupom")) {

            const text = interaction.fields.getTextInputValue("text");
            if(text !== "SIM") return interaction.reply({content:`${emoji(2)} | Ação cancelada!`, ephemeral:true});
            await interaction.reply({content:`${emoji(11)} | Resetando...`, ephemeral:true});

            
            const a = await cupom.all();
            if(a.length <= 0) return interaction.editReply({content:`${emoji(2)} | Não encontrei nada desse tipo para resetar.`})
            await cupom.deleteAll(); 
            interaction.editReply({
                content: `${emoji(11)} | Os Cupons foram resetadas com sucesso!, foram removidas ${a.length} Cupons!`
            });
        }
        if(customId.endsWith("_estaticandperfil")) {
            const modal = new ModalBuilder()
            .setCustomId(`${userid}_statsresetmodal`)
            .setTitle("⚙ | Confirmar");

            const text = new TextInputBuilder()
            .setStyle(1)
            .setLabel(`para continuar escreva "SIM"`)
            .setRequired(true)
            .setPlaceholder("SIM")
            .setCustomId("text")
            .setMaxLength(10);

            modal.addComponents(new ActionRowBuilder().addComponents(text));

            return interaction.showModal(modal);
        }
        if(customId.endsWith("_statsresetmodal")) {
            const text = interaction.fields.getTextInputValue("text");
            if(text !== "SIM") return interaction.reply({content:`${emoji(2)} | Ação cancelada!`, ephemeral:true});
            await interaction.reply({content:`${emoji(44)} | Aguarde um momento...`, ephemeral:true});
            const all = await saldo.all().filter(a => a.data.compras);
            for(const kk of all) {
                await saldo.delete(`${kk.ID}.compras`);
                await saldo.delete(`${kk.ID}.ultimacompra`);
                await saldo.delete(`${kk.ID}.primeiracompra`);
                await saldo.delete(`${kk.ID}.gasto`);
            };
            interaction.editReply({
                content: `${emoji(11)} | Todas as Estatísticas e Perfil foram resetados!`
            });
        }
        if(customId.endsWith("_rankproduto")) {
            const modal = new ModalBuilder()
            .setCustomId(`${userid}_rankproductmodal`)
            .setTitle("⚙ | Confirmar");

            const text = new TextInputBuilder()
            .setStyle(1)
            .setLabel(`para continuar escreva "SIM"`)
            .setRequired(true)
            .setPlaceholder("SIM")
            .setCustomId("text")
            .setMaxLength(10);

            modal.addComponents(new ActionRowBuilder().addComponents(text));

            return interaction.showModal(modal);
        }
        if(customId.endsWith("_rankproductmodal")) {
            const text = interaction.fields.getTextInputValue("text");
            if(text !== "SIM") return interaction.reply({content:`${emoji(2)} | Ação cancelada!`, ephemeral:true});
            await interaction.reply({content:`${emoji(44)} | Aguarde um momento...`, ephemeral:true});
            const all = await db.all();
            for(const kk of all) {
                await db.set(`${kk.ID}.estatisticas`, {
                    "total": 0,
                    "rendeu": 0.00
                });
            };
            interaction.editReply({
                content: `${emoji(11)} | Rank de Produtos Resetados com sucesso!`
            });
        }
        if(customId.endsWith("_giftcardsreset")) {
            const modal = new ModalBuilder()
            .setCustomId(`${userid}_giftcardmodalreset`)
            .setTitle("⚙ | Confirmar");

            const text = new TextInputBuilder()
            .setStyle(1)
            .setLabel(`para continuar escreva "SIM"`)
            .setRequired(true)
            .setPlaceholder("SIM")
            .setCustomId("text")
            .setMaxLength(10);

            modal.addComponents(new ActionRowBuilder().addComponents(text));

            return interaction.showModal(modal);
        }
        if(customId.endsWith("_giftcardmodalreset")) {
            const text = interaction.fields.getTextInputValue("text");
            if(text !== "SIM") return interaction.reply({content:`${emoji(2)} | Ação cancelada!`, ephemeral:true});
            await interaction.reply({content:`${emoji(44)} | Aguarde um momento...`, ephemeral:true});
            await gift.deleteAll();
            interaction.editReply({
                content: `${emoji(11)} | Todos os Gift_Cards foram Resetados!`
            });
        }
        if(customId.endsWith("_keysreset")) {
            const modal = new ModalBuilder()
            .setCustomId(`${userid}_keysresetmodal`)
            .setTitle("⚙ | Confirmar");

            const text = new TextInputBuilder()
            .setStyle(1)
            .setLabel(`para continuar escreva "SIM"`)
            .setRequired(true)
            .setPlaceholder("SIM")
            .setCustomId("text")
            .setMaxLength(10);

            modal.addComponents(new ActionRowBuilder().addComponents(text));

            return interaction.showModal(modal);
        }
        if(customId.endsWith("_keysresetmodal")) {
            const text = interaction.fields.getTextInputValue("text");
            if(text !== "SIM") return interaction.reply({content:`${emoji(2)} | Ação cancelada!`, ephemeral:true});
            await interaction.reply({content:`${emoji(44)} | Aguarde um momento...`, ephemeral:true});
            await key.deleteAll();
            interaction.editReply({
                content: `${emoji(11)} | Todas as Key's foram Resetados!`
            });
        }
        if(customId.endsWith("_dropsreset")) {
            const modal = new ModalBuilder()
            .setCustomId(`${userid}_dropsresetmodal`)
            .setTitle("⚙ | Confirmar");

            const text = new TextInputBuilder()
            .setStyle(1)
            .setLabel(`para continuar escreva "SIM"`)
            .setRequired(true)
            .setPlaceholder("SIM")
            .setCustomId("text")
            .setMaxLength(10);

            modal.addComponents(new ActionRowBuilder().addComponents(text));

            return interaction.showModal(modal);
        }
        if(customId.endsWith("_dropsresetmodal")) {
            const text = interaction.fields.getTextInputValue("text");
            if(text !== "SIM") return interaction.reply({content:`${emoji(2)} | Ação cancelada!`, ephemeral:true});
            await interaction.reply({content:`${emoji(44)} | Aguarde um momento...`, ephemeral:true});
            await drop.deleteAll();
            interaction.editReply({
                content: `${emoji(11)} | Todos os Drop's foram Resetados!`
            });
        }
        if(customId.endsWith("_produtosallreset")) {
            const modal = new ModalBuilder()
            .setCustomId(`${userid}_produtosallresetmodal`)
            .setTitle("⚙ | Confirmar");

            const text = new TextInputBuilder()
            .setStyle(1)
            .setLabel(`para continuar escreva "SIM"`)
            .setRequired(true)
            .setPlaceholder("SIM")
            .setCustomId("text")
            .setMaxLength(10);

            modal.addComponents(new ActionRowBuilder().addComponents(text));

            return interaction.showModal(modal);
        }
        if(customId.endsWith("_produtosallresetmodal")) {
            const text = interaction.fields.getTextInputValue("text");
            if(text !== "SIM") return interaction.reply({content:`${emoji(2)} | Ação cancelada!`, ephemeral:true});
            await interaction.reply({content:`${emoji(44)} | Aguarde um momento...`, ephemeral:true});
            await db.deleteAll();
            interaction.editReply({
                content: `${emoji(11)} | Todos os Produtos foram Resetados!`
            });
        }
        if(customId.endsWith("_paineisallreset")) {
            const modal = new ModalBuilder()
            .setCustomId(`${userid}_paineisallresetmodal`)
            .setTitle("⚙ | Confirmar");

            const text = new TextInputBuilder()
            .setStyle(1)
            .setLabel(`para continuar escreva "SIM"`)
            .setRequired(true)
            .setPlaceholder("SIM")
            .setCustomId("text")
            .setMaxLength(10);

            modal.addComponents(new ActionRowBuilder().addComponents(text));

            return interaction.showModal(modal);
        }
        if(customId.endsWith("_paineisallresetmodal")) {
            const text = interaction.fields.getTextInputValue("text");
            if(text !== "SIM") return interaction.reply({content:`${emoji(2)} | Ação cancelada!`, ephemeral:true});
            await interaction.reply({content:`${emoji(44)} | Aguarde um momento...`, ephemeral:true});
            await pn.deleteAll();
            interaction.editReply({
                content: `${emoji(11)} | Todos os Paineis foram Resetados!`
            });
        }
        

function emoji(id) {
    try {
        const emj = personalizar.get(`${id}`);
        return emj || "❔";
    } catch {
        return "❔"
    }
}
    }}
