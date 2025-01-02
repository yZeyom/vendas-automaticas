const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, ActivityType, StringSelectMenuBuilder, ChannelSelectMenuBuilder, ChannelType, RoleSelectMenuBuilder } = require("discord.js");
const {bot,carrinho,db,logs,pn,rd,vnd, token, cupom, personalizar} = require("../../database/index"); 
let timer;
const axios = require("axios");

module.exports = {
    name:"interactionCreate",
    run: async( interaction, client) => {
        const customId = interaction.customId;
        if(!customId) return;
        const userid = customId.split("_")[0];
        if(interaction.user.id !== userid) return;
        const id = customId.split("_")[1];
        if(!id) return;
        const cm = await cupom.get(`${id}`);
        if(!cm) return;
        if(customId.endsWith("_porcentagemdesconto")) {
            resettime();
            const modal = new ModalBuilder()
            .setTitle(`🔧 | Alterar Porcentagem do desconto`)
            .setCustomId(`${userid}_${id}_porcentagemdescontomodal`);

            const text = new TextInputBuilder()
            .setCustomId("text")
            .setStyle(1)
            .setPlaceholder("50")
            .setLabel("nova porcentagem:")
            .setRequired(true)
            .setMaxLength(2);

            modal.addComponents(new ActionRowBuilder().addComponents(text));

            return interaction.showModal(modal);
        }
        if(customId.endsWith("_porcentagemdescontomodal")) {
            resettime();
            const text = parseInt(interaction.fields.getTextInputValue("text"));
            if(isNaN(text)) interaction.reply({content:`${emoji(29)} | Valor invalido!`, ephemeral:true});
            if(text < 1) interaction.reply({content:`${emoji(29)} | Valor invalido!`, ephemeral:true});
            await cupom.set(`${id}.porcentagem`, text);
            await embed();
            interaction.followUp({content:`${emoji(11)} | O Valor da Porcentagem foi alterada para \`${text}%\``, ephemeral:true});
        }
        if(customId.endsWith("_valormincupom")) {
            resettime();
            const modal = new ModalBuilder()
            .setCustomId(`${userid}_${id}_valormincupommodal`)
            .setTitle("🔧 | Alterar Valor mínimo da compra");

            const text = new TextInputBuilder()
            .setCustomId("text")
            .setStyle(1)
            .setLabel("valor mínimo para o cupom ser utilizado:")
            .setPlaceholder("20")
            .setRequired(true)
            .setMaxLength(10);

            modal.addComponents(new ActionRowBuilder().addComponents(text));

            return interaction.showModal(modal);
        }
        if(customId.endsWith("_valormincupommodal")) {
            resettime();
            const text = parseFloat(interaction.fields.getTextInputValue("text")).toFixed(2);
            if(isNaN(text)) return interaction.reply({content:`${emoji(29)} | Você digitou um valor invalido.`, ephemeral:true});
            if(text < 0) return interaction.reply({content:`${emoji(29)} | Você digitou um valor invalido.`, ephemeral:true});
            await cupom.set(`${id}.valorminimo`, text);
            await embed();
            interaction.followUp({content:`${emoji(11)}  | O valor mínimo da compra para utilizar esse cupom foi atualizado com sucesso para \`R$${text}\`.`, ephemeral:true});
        }
        if(customId.endsWith("_quantidadecupom")) {
            resettime();
            const modal = new ModalBuilder()
            .setCustomId(`${userid}_${id}_quantiacupommodal`)
            .setTitle("🔧 | Alterar quantidade do cupom");

            const text = new TextInputBuilder()
            .setCustomId(`text`)
            .setLabel("nova quantidade:")
            .setPlaceholder("5")
            .setRequired(true)
            .setMaxLength(4)
            .setStyle(1);

            modal.addComponents(new ActionRowBuilder().addComponents(text));

            return interaction.showModal(modal);
        }
        if(customId.endsWith("_quantiacupommodal")) {
            resettime();
            const text = parseInt(interaction.fields.getTextInputValue("text"));
            if(isNaN(text)) return interaction.reply({content:`${emoji(29)} | Você digitou um valor invalido.`, ephemeral:true});
            if(text < 0) return interaction.reply({content:`${emoji(29)} | Você digitou um valor invalido.`, ephemeral:true});
            await cupom.set(`${id}.quantidade`, text);
            await embed();
            interaction.followUp({content:`${emoji(11)}  |  A quantidade foi alterada com sucesso para \`${text}\`.`, ephemeral:true});
        }
        if(customId.endsWith("_cargocupom")) {
            resettime();
            interaction.update({
                embeds:[
                    new EmbedBuilder()
                    .setAuthor({name:`${interaction.client.user.username}`, iconURL: interaction.client.user.displayAvatarURL()})
                    .setDescription("Selecione o cargo necessário para poder utilizar esse cupom")
                    .setColor("Random")
                ],
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new RoleSelectMenuBuilder()
                        .setCustomId(`${userid}_${id}_selectcargocupom`)
                        .setMaxValues(1)
                        .setPlaceholder("Selecione o Cargo:")
                    ),
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_${id}_removerolecupom`)
                        .setLabel("Remover Cargo")
                        .setStyle(4)
                        .setEmoji("<:lixo_cloud:1221875710956797992>"),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_${id}_voltarslakkk123`)
                        .setLabel("Voltar")
                        .setStyle(2)
                        .setEmoji("⬅"),
                    )
                ]
            })
        }
        if(customId.endsWith("_selectcargocupom")) {
            const i = interaction.values[0];
            await cupom.set(`${id}.cargo`, i);
            embed();
        }
        if(customId.endsWith("_removerolecupom")) {
            resettime();
            await cupom.set(`${id}.cargo`, "Não Definido");
            await embed();
        }
        if(customId.endsWith("_voltarslakkk123")) {
            resettime();
            embed();
        }
        if(customId.endsWith("_deletecupom")) {
            resettime();
            const modal = new ModalBuilder()
            .setCustomId(`${userid}_${id}_deletecupommodal`)
            .setTitle("⚙ | Confirmar");

            const text = new TextInputBuilder()
            .setCustomId("text")
            .setStyle(1)
            .setLabel('Para continuar escreva "SIM"')
            .setPlaceholder("SIM")
            .setMaxLength(3)
            .setMinLength(3)
            .setRequired(true);

            modal.addComponents(new ActionRowBuilder().addComponents(text));

            return interaction.showModal(modal);
        }
        if(customId.endsWith("_deletecupommodal")) {
            resettime();
            const text = interaction.fields.getTextInputValue("text");
            if(text !== "SIM") return interaction.reply({content:`${emoji(11)} | Cancelado com sucesso!`, ephemeral:true});
            await cupom.delete(`${id}`);
            await interaction.update({
                embeds:[
                    new EmbedBuilder()
                    .setDescription(`${emoji(11)} | O Cupom \`${id}\` foi deletado com sucesso!`)
                    .setColor(await bot.get("cor"))
                ],
                components:[]
            });
            interaction.followUp({
                content:`${emoji(11)} | Deletado com sucesso!`,
                ephemeral:true
            })
        }
        
        function resettime() {
            
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            interaction.message.edit({
                content:"⚠️ | Use o Comando Novamente!",
                components:[],
                embeds:[],
                files:[]
            });
        }, 600000);
        }
        async function embed() {
            const cm = await cupom.get(`${id}`); 
            if(!cm) return interaction.reply({content:`${emoji(29)} | Não existe nenhum cupom com este nome`, ephemeral:true});
            const role = interaction.guild.roles.cache.get(cm.cargo) || "Este cupom pode ser utilizado por qualquer usuário!";
        
            await interaction.update({
                embeds:[
                    new EmbedBuilder()
                    .setTitle(`${interaction.guild.name} | Gerenciar Cupom`)
                    .setDescription(`${emoji(12)} **| Nome:** \`${id}\`\n${emoji(3)} **| Porcentagem de Desconto:** \`${cm.porcentagem}\`\n${emoji(14)} **| Valor Minimo:** \`${cm.valorminimo}\`\n${emoji(21)} **| Quantidade:** \`${cm.quantidade}\`\n🔒 **| Sò pode ser usado pelo cargo:** ${role}`)
                    .setColor(await bot.get("cor"))
                    .setFooter({text:`${interaction.guild.name} - Todos os Direitos reservados.`, iconURL: interaction.client.user.displayAvatarURL()})
                    .setThumbnail(interaction.client.user.displayAvatarURL())
                ],
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_${id}_porcentagemdesconto`)
                        .setLabel("Porcentagem de desconto")
                        .setStyle(3)
                        .setEmoji("<:Dinheiro_cloud:1221872674188562443>"),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_${id}_valormincupom`)
                        .setLabel("Valor Mínimo")
                        .setStyle(3)
                        .setEmoji("<:carrin_cloud:1221873043958268045>"),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_${id}_quantidadecupom`)
                        .setLabel("Quantidade")
                        .setStyle(3)
                        .setEmoji("<:folha_cloud:1221870992817782936>"),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_${id}_cargocupom`)
                        .setLabel("Cargo")
                        .setStyle(3)
                        .setEmoji("<:users_cloud:1213635311905669203>"),
                    ),
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_${id}_deletecupom`)
                        .setLabel("DELETAR")
                        .setStyle(4)
                        .setEmoji("<:lixo_cloud:1221875710956797992>"),
                    ),
                ]
            });
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