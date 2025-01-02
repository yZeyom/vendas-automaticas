const { JsonDatabase } = require("wio.db");

const bot = new JsonDatabase({databasePath:"./database/bot.json"});
const logs = new JsonDatabase({databasePath:"./database/logs.json"});
const pn = new JsonDatabase({databasePath:"./database/paineis.json"});
const db = new JsonDatabase({databasePath:"./database/produtos.json"});
const rd = new JsonDatabase({databasePath:"./database/rendimentos.json"});
const vnd = new JsonDatabase({databasePath:"./database/vendas.json"});
const token = new JsonDatabase({databasePath:"./token.json"});
const personalizar = new JsonDatabase({databasePath:"./database/personalizar.json"});
const perm = new JsonDatabase({databasePath:"./database/perms.json"});
const key = new JsonDatabase({databasePath:"./database/key.json"});
const drop = new JsonDatabase({databasePath:"./database/drop.json"});
const saldo = new JsonDatabase({databasePath:"./database/saldo.json"});
const gift = new JsonDatabase({databasePath:"./database/gift.json"});
const cupom  = new JsonDatabase({databasePath:"./database/cupom.json"});


module.exports.bot = bot;
module.exports.logs = logs;
module.exports.pn = pn;
module.exports.db = db;
module.exports.rd = rd;
module.exports.vnd = vnd;
module.exports.token = token;
module.exports.personalizar = personalizar;
module.exports.perm = perm;
module.exports.key = key;
module.exports.drop = drop;
module.exports.saldo = saldo;
module.exports.gift = gift;
module.exports.cupom = cupom;