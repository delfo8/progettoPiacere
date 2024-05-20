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

// Mappa per memorizzare le informazioni degli utenti
const users = {};

// Risposta al comando /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  users[chatId] = {}; // Inizializza i dati dell'utente
  bot.sendMessage(chatId, "Benvenuto nel Coach di Fitness! Qual è il tuo nome?");
});

// Risposta ai messaggi dell'utente
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!users[chatId]) {
    // Ignora i messaggi non pertinenti dopo la registrazione
    return;
  }

  if (!users[chatId].name) {
    users[chatId].name = text;
    bot.sendMessage(chatId, `Ciao ${text}! Quanti anni hai?`);
  } else if (!users[chatId].age) {
    const age = parseInt(text);
    if (isNaN(age)) {
      bot.sendMessage(chatId, "Per favore, inserisci un'età valida.");
    } else {
      users[chatId].age = age;
      bot.sendMessage(chatId, `Perfetto! Hai ${age} anni. Quanto pesi (in kg)?`);
    }
  } else if (!users[chatId].weight) {
    const weight = parseFloat(text);
    if (isNaN(weight)) {
      bot.sendMessage(chatId, "Per favore, inserisci un peso valido in kg.");
    } else {
      users[chatId].weight = weight;
      bot.sendMessage(chatId, `Ottimo! Pesi ${weight} kg. Quanto sei alto (in cm)?`);
    }
  } else if (!users[chatId].height) {
    const height = parseFloat(text);
    if (isNaN(height)) {
      bot.sendMessage(chatId, "Per favore, inserisci un'altezza valida in cm.");
    } else {
      users[chatId].height = height;
      const bmi = calculateBMI(users[chatId].weight, users[chatId].height);
      const advice = getAdvice(bmi);
      bot.sendMessage(chatId, `Sei alto ${height} cm. Il tuo BMI è ${bmi.toFixed(2)}. ${advice}`);
      askForChoice(chatId);
    }
  }
});

// Funzione per calcolare il BMI
function calculateBMI(weight, height) {
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
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

// Funzione per chiedere se l'utente vuole consigli sull'allenamento o sulla dieta
function askForChoice(chatId) {
  bot.sendMessage(chatId, "Vuoi ricevere consigli sull'allenamento o sulla dieta?", {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Allenamento', callback_data: 'choice_allenamento' }],
        [{ text: 'Dieta', callback_data: 'choice_dieta' }]
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

// Funzione per inviare consigli dietetici basati sul BMI
function sendDietAdvice(chatId, bmi) {
  let dietAdvice;
  if (bmi < 18.5) {
    dietAdvice = "Ti consigliamo una dieta ricca di proteine e carboidrati per aumentare la massa muscolare. Esempio: Colazione con uova e pane integrale, pranzo con pollo e riso, cena con pesce e patate.";
  } else if (bmi < 24.9) {
    dietAdvice = "Continua a mantenere una dieta equilibrata. Esempio: Colazione con yogurt e frutta, pranzo con insalata e quinoa, cena con tofu e verdure.";
  } else if (bmi < 29.9) {
    dietAdvice = "Ti consigliamo una dieta a basso contenuto calorico. Esempio: Colazione con frullato di verdure, pranzo con insalata di pollo, cena con zuppa di verdure.";
  } else {
    dietAdvice = "Ti consigliamo di consultare un professionista della salute per una dieta personalizzata. Esempio: Colazione con avena, pranzo con pesce alla griglia e verdure, cena con insalata di legumi.";
  }
  bot.sendMessage(chatId, dietAdvice);
}

// Gestione dei pulsanti inline
bot.on('callback_query', (callbackQuery) => {
  const action = callbackQuery.data;
  const chatId = callbackQuery.message.chat.id;

  if (action.startsWith('choice_')) {
    const choice = action.split('_')[1];
    if (choice === 'allenamento') {
      askForLevel(chatId);
    } else if (choice === 'dieta') {
      const bmi = calculateBMI(users[chatId].weight, users[chatId].height);
      sendDietAdvice(chatId, bmi);
    }
  } else if (action.startsWith('level_')) {
    const level = action.split('_')[1];
    users[chatId].level = level;
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
