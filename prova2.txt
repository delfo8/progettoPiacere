const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');
const workoutModule = require('./workout.js');

const db = require('./db.js');

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
  const chatId = msg.chat.id;
  db.query('INSERT INTO users (chat_id) VALUES (?) ON DUPLICATE KEY UPDATE chat_id = chat_id', [chatId], (err) => {
    if (err) {
      console.error('Errore durante l\'inserimento nel database:', err);
      return;
    }
    bot.sendMessage(chatId, "Benvenuto nel Coach di Fitness! Qual è il tuo nome?");
  });
});

// Risposta ai messaggi dell'utente
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  db.query('SELECT * FROM users WHERE chat_id = ?', [chatId], (err, results) => {
    if (err) {
      console.error('Errore durante la query:', err);
      return;
    }

    const user = results[0];

    if (!user.name) {
      db.query('UPDATE users SET name = ? WHERE chat_id = ?', [text, chatId], (err) => {
        if (err) {
          console.error('Errore durante l\'aggiornamento del database:', err);
          return;
        }
        bot.sendMessage(chatId, `Ciao ${text}! Quanti anni hai?`);
      });
    } else if (!user.age) {
      db.query('UPDATE users SET age = ? WHERE chat_id = ?', [text, chatId], (err) => {
        if (err) {
          console.error('Errore durante l\'aggiornamento del database:', err);
          return;
        }
        bot.sendMessage(chatId, `Perfetto! Hai ${text} anni. Quanto pesi (in kg)?`);
      });
    } else if (!user.weight) {
      db.query('UPDATE users SET weight = ? WHERE chat_id = ?', [text, chatId], (err) => {
        if (err) {
          console.error('Errore durante l\'aggiornamento del database:', err);
          return;
        }
        bot.sendMessage(chatId, `Ottimo! Pesi ${text} kg. Quanto sei alto (in cm)?`);
      });
    } else if (!user.height) {
      db.query('UPDATE users SET height = ?, bmi = ? WHERE chat_id = ?', [text, calculateBMI(user.weight, text), chatId], (err) => {
        if (err) {
          console.error('Errore durante l\'aggiornamento del database:', err);
          return;
        }
        const bmi = calculateBMI(user.weight, text);
        const advice = getAdvice(bmi);
        bot.sendMessage(chatId, `Sei alto ${text} cm. Il tuo BMI è ${bmi.toFixed(2)}. ${advice}`);
        askForGuidance(chatId);
      });
    }
  });
});

// Funzione per calcolare il BMI
function calculateBMI(weight, height) {
  const weightInKg = parseFloat(weight);
  const heightInMeters = parseFloat(height) / 100;
  return weightInKg / (heightInMeters * heightInMeters);
}

// Funzione per fornire consigli basati sul BMI
function getAdvice(bmi) {
  if (bmi < 18.5) {
    return "Sei sotto peso. Ti consigliamo di seguire un programma per aumentare la massa muscolare.";
  } else if (bmi < 24.9) {
    return "Hai un peso normale. Continua così con un mix di allenamenti cardio e di forza.";
  } else if (bmi < 29.9) {
    return "Sei in sovrappeso. Ti consigliamo di seguire un programma per dimagrire.";
  } else {
    return "Sei obeso. Ti consigliamo di consultare un professionista della salute e seguire un programma per dimagrire.";
  }
}

// Funzione per chiedere il tipo di guida (allenamento o dieta)
function askForGuidance(chatId) {
  bot.sendMessage(chatId, "Cosa preferisci ricevere?", {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Consigli di Allenamento', callback_data: 'guidance_workout' }],
        [{ text: 'Consigli Dietetici', callback_data: 'guidance_diet' }]
      ]
    }
  });
}

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
    db.query('UPDATE users SET level = ? WHERE chat_id = ?', [level, chatId], (err) => {
      if (err) {
        console.error('Errore durante l\'aggiornamento del database:', err);
        return;
      }
      bot.sendMessage(chatId, `Hai selezionato il livello: ${level}`);
      sendMainMenu(chatId, level);
    });
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
  } else if (action === 'guidance_workout') {
    askForLevel(chatId);
  } else if (action === 'guidance_diet') {
    db.query('SELECT bmi FROM users WHERE chat_id = ?', [chatId], (err, results) => {
      if (err) {
        console.error('Errore durante la query:', err);
        return;
      }
      const bmi = results[0].bmi;
      dietModule.getDietAdvice(bot, { chat: { id: chatId } }, bmi);
    });
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
