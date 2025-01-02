const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, ActivityType, StringSelectMenuBuilder, ChannelSelectMenuBuilder, ChannelType, RoleSelectMenuBuilder } = require("discord.js");
const {bot,carrinho,db,logs,pn,rd,vnd, token, personalizar} = require("../../database/index"); 
let timer = {};
const axios = require("axios");
const moment = require("moment");
const emojiRegex = require('emoji-regex');



module.exports = {
    name:"guildMemberAdd", // Nome do Evento 
    run: async( member, client) => {
        const automod = await bot.get("automod");
        const antfake = automod.antifake;
        const boasvindas = automod.boasvindas;

        const data = new Date();
if (antfake.dias) {
    data.setDate(data.getDate() - Number(antfake.dias));

    if (member.createdTimestamp < data.getTime()) {
        console.log(`Membro ${user.data.id} se juntou há mais de ${antfake.dias} dias. Aplicando kick...`);
        return member.kick("Sistema de AutoMod");
    }
}
        if(antfake.nomes.includes(member.user.username)) return member.kick("Sistema de AutoMod");
        if(antfake.nomes.includes(member.displayName)) return member.kick("Sistema de AutoMod");

        if(antfake?.status.includes(member.presence?.status)) return member.kick("Sistema de AutoMod");

        boasvindas.canais.forEach((k) => {
            const channel = client.channels.cache.get(k);
            if(channel) {
                let msg = boasvindas.message;
                msg = msg.replace(/{member}/g, `<@${member.id}>`);
                msg = msg.replace(/{guildname}/g, member.guild.name);
                channel.send({
                    content:`${msg}`
                }).then((msg) => {
                    setTimeout(() => {
                        msg?.delete().catch(() => {})
                    }, Number(boasvindas.tempoaapgar) * 1000);
                }).catch(() => {})
            }
        });

        await bot.get("automod.autorole").map((a) => {
            member.roles.add(a).catch(() => {});
        });
    }};