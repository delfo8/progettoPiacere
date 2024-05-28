const Server = require('./server.js');
const TelegramBotHandler = require('./bot.js');

const token = '7093419213:AAEN1dgtcnm5KEr25c9J_csWuLd1CsYRl_o';

const server = new Server();
const bot = new TelegramBotHandler(token);

server.start();
