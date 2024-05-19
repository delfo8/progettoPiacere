const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');

// Sostituisci con il token del tuo bot
const token = '7093419213:AAEN1dgtcnm5KEr25c9J_csWuLd1CsYRl_o';

// Crea una nuova istanza del bot Telegram
const bot = new TelegramBot(token, { polling: true });

// Crea un'app Express
const app = express();
app.use(bodyParser.json());

// Definisci una route di base
app.get('/', (req, res) => {
  res.send('CoachBot è in esecuzione');
});

// Inizia il server su una porta specifica
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Risposta al comando /start
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Benvenuto nel Coach di Fitness! Iniziamo con la tua registrazione.");
});

// Aggiungi altre funzionalità qui
