const {Client , GatewayIntentBits,Collection, Partials } = require("discord.js");
const { JsonDatabase } = require("wio.db");
console.clear();


const client = new Client({
    intents: Object.values(GatewayIntentBits),
    partials: Object.values(Partials)
});

module.exports = client;

client.slashCommands = new Collection();

const {token} = require("./token.json");

client.login(token);

const evento = require("./handler/Events");

evento.run(client);

require("./handler/index")(client);
process.on('unhandRejection', (reason, promise) => {

    console.log(`🚫 Erro Detectado:\n\n` + reason, promise)

  });

  process.on('uncaughtException', (error, origin) => {

    console.log(`🚫 Erro Detectado:\n\n` + error, origin)
    
  });

// Lunar Store by yZeyom