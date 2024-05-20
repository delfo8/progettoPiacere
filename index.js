const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');
const workoutModule = require('./workout.js');

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
  askForLevel(msg.chat.id);
});

// Funzione per chiedere il livello di fitness
function askForLevel(chatId) {
  bot.sendMessage(chatId, "Qual è il tuo livello di fitness?", {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Principiante', callback_data: 'level_principiante' }],
        [{ text: 'Intermedio', callback_data: 'level_intermedio' }],
        [{ text: 'Avanzato', callback_data: 'level_avanzato' }]
      ]
    }
  });
}

// Funzione per inviare il menu principale
function sendMainMenu(chatId, level) {
  bot.sendMessage(chatId, "Scegli un'opzione:", {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Allenamento Muscolare', callback_data: `category_muscle_${level}` }],
        [{ text: 'Allenamento Dimagrimento/Cardio', callback_data: `category_cardio_${level}` }]
      ]
    }
  });
}

// Gestione dei pulsanti inline
bot.on('callback_query', (callbackQuery) => {
  const action = callbackQuery.data;
  const chatId = callbackQuery.message.chat.id;

  if (action.startsWith('level_')) {
    const level = action.split('_')[1];
    bot.sendMessage(chatId, `Hai selezionato il livello: ${level}`);
    sendMainMenu(chatId, level);
  } else if (action.startsWith('category_')) {
    const parts = action.split('_');
    const category = parts[1];
    const level = parts[2];

    if (category === 'muscle') {
      sendMuscleSelection(chatId, level);
    } else if (category === 'cardio') {
      workoutModule.getCategoryWorkout(bot, { chat: { id: chatId } }, 'cardio', level);
    }
  } else if (action.startsWith('muscle_')) {
    const parts = action.split('_');
    const muscle = parts[1];
    const level = parts[2];
    workoutModule.getCategoryWorkout(bot, { chat: { id: chatId } }, muscle, level);
  }
});

// Funzione per inviare la selezione del muscolo
function sendMuscleSelection(chatId, level) {
  bot.sendMessage(chatId, "Scegli il muscolo che desideri allenare:", {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Pettorali', callback_data: `muscle_pettorali_${level}` }],
        [{ text: 'Gambe', callback_data: `muscle_gambe_${level}` }],
        [{ text: 'Addominali', callback_data: `muscle_addominali_${level}` }],
        [{ text: 'Schiena', callback_data: `muscle_schiena_${level}` }],
        [{ text: 'Annulla', callback_data: `cancel_${level}` }]
      ]
    }
  });
}
