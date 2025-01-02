const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, ActivityType, StringSelectMenuBuilder, ChannelSelectMenuBuilder, ChannelType, RoleSelectMenuBuilder } = require("discord.js");
const {bot,carrinho,db,logs,pn,rd,vnd, token, personalizar} = require("../../database/index"); 


module.exports = {
    name:"ready",
    run:async(client) => {
        const ok = {};

        setInterval(async() => {
            const kkk = await bot.get("automod.mensagem_auto");
            if(!kkk.system) return;
            await kkk.mensagem.map((msg) => {
                if(ok[msg.ind] !== "Ativo") {
                    const channel = client.channels.cache.get(msg.channel);
                    if(channel) {
                        ok[msg.ind] = "Ativo";
                        setTimeout(() => {
                            channel.send({
                                embeds:[
                                    new EmbedBuilder()
                                    .setTitle(msg.title)
                                    .setDescription(msg.desc)
                                    .setColor(bot.get("cor"))
                                    .setImage(msg.banner)
                                ],
                                components:[
                                    new ActionRowBuilder()
                                    .addComponents(
                                        new ButtonBuilder()
                                        .setCustomId(`iusnad8syadn187238127`)
                                        .setLabel("Mensagem Automatica")
                                        .setStyle(2)
                                        .setDisabled(true)
                                    )
                                ]
                            }).catch(() => {});
                            delete ok[msg.ind];
                        }, Number(msg.tempo) * 1000);
                    }
                }
            });
        }, 1000);
        
    }
} 