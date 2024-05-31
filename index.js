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

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  db.query('DELETE FROM users WHERE chat_id = ?', [chatId], (err) => {
    if (err) {
      console.error('Errore durante l\'eliminazione dell\'utente dal database:', err);
      bot.sendMessage(chatId, "Si è verificato un errore durante il processo di registrazione. Riprova più tardi.");
      return;
    }

    db.query('INSERT INTO users (chat_id) VALUES (?)', [chatId], (err) => {
      if (err) {
        console.error('Errore durante l\'inserimento nel database:', err);
        bot.sendMessage(chatId, "Si è verificato un errore durante il processo di registrazione. Riprova più tardi.");
        return;
      }
      bot.sendMessage(chatId, "Benvenuto nel Coach di Fitness! Qual è il tuo nome?");
    });
  });
});

bot.onText(/\/logout/, (msg) => {
  const chatId = msg.chat.id;
  db.query('DELETE FROM users WHERE chat_id = ?', [chatId], (err) => {
    if (err) {
      console.error('Errore durante la cancellazione dall\'database:', err);
      bot.sendMessage(chatId, "Si è verificato un errore durante il logout. Riprova più tardi.");
      return;
    }
    bot.sendMessage(chatId, "✅ Hai eseguito il logout con successo. Se desideri utilizzare nuovamente il Coach di Fitness, puoi avviare una nuova sessione con il comando /start.");
  });
});

// Risposta ai messaggi dell'utente
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text.startsWith('/')) {
    return;
  }

  db.query('SELECT * FROM users WHERE chat_id = ?', [chatId], (err, results) => {
    if (err) {
      console.error('Errore durante la query:', err);
      bot.sendMessage(chatId, "Si è verificato un errore durante il recupero dei dati. Riprova più tardi.");
      return;
    }

    const user = results[0];

    if (!user.name) {
      db.query('UPDATE users SET name = ? WHERE chat_id = ?', [text, chatId], (err) => {
        if (err) {
          console.error('Errore durante l\'aggiornamento del database:', err);
          bot.sendMessage(chatId, "Si è verificato un errore durante la registrazione del nome. Riprova più tardi.");
          return;
        }
        bot.sendMessage(chatId, `Ciao ${text}! Quanti anni hai?`);
      });
    } else if (!user.age) {
      if (!isNaN(text)) {
        db.query('UPDATE users SET age = ? WHERE chat_id = ?', [text, chatId], (err) => {
          if (err) {
            console.error('Errore durante l\'aggiornamento del database:', err);
            bot.sendMessage(chatId, "Si è verificato un errore durante la registrazione dell'età. Riprova più tardi.");
            return;
          }
          bot.sendMessage(chatId, `Perfetto! Hai ${text} anni. Quanto pesi (in kg)?`);
        });
      } else {
        bot.sendMessage(chatId, "Inserisci un numero valido per l'età.");
      }
    } else if (!user.weight) {
      if (!isNaN(text)) {
        db.query('UPDATE users SET weight = ? WHERE chat_id = ?', [text, chatId], (err) => {
          if (err) {
            console.error('Errore durante l\'aggiornamento del database:', err);
            bot.sendMessage(chatId, "Si è verificato un errore durante la registrazione del peso. Riprova più tardi.");
            return;
          }
          bot.sendMessage(chatId, `Ottimo! Pesi ${text} kg. Quanto sei alto (in cm)?`);
        });
      } else {
        bot.sendMessage(chatId, "Inserisci un numero valido per il peso.");
      }
    } else if (!user.height) {
      if (!isNaN(text)) {
        const height = parseFloat(text);
        const bmi = calculateBMI(user.weight, height);
        db.query('UPDATE users SET height = ?, bmi = ? WHERE chat_id = ?', [text, bmi, chatId], (err) => {
          if (err) {
            console.error('Errore durante l\'aggiornamento del database:', err);
            bot.sendMessage(chatId, "Si è verificato un errore durante la registrazione dell'altezza. Riprova più tardi.");
            return;
          }
          const advice = getAdvice(bmi);
          bot.sendMessage(chatId, `Sei alto ${text} cm. Il tuo BMI è ${bmi.toFixed(2)}. ${advice}`);
          sendUserDataTable(chatId, user.name, user.age, user.weight, text, bmi);
          askForGuidance(chatId);
        });
      } else {
        bot.sendMessage(chatId, "Inserisci un numero valido per l'altezza.");
      }
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

// Funzione per inviare i dati dell'utente in una tabella ordinata
function sendUserDataTable(chatId, name, age, weight, height, bmi) {
  const table = `
    <b>I tuoi dati:</b>
    Nome: ${name}
    Età: ${age}
    Peso: ${weight} kg
    Altezza: ${height} cm
    BMI: ${bmi.toFixed(2)}
  `;
  bot.sendMessage(chatId, table, { parse_mode: 'HTML' });
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
        [{ text: '🏋️‍♂️ Allenamento Muscolare', callback_data: `category_muscle_${level}` }],
        [{ text: '🏃‍♂️ Allenamento Dimagrimento/Cardio', callback_data: `category_cardio_${level}` }]
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
        bot.sendMessage(chatId, "Si è verificato un errore durante la registrazione del livello. Riprova più tardi.");
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
        bot.sendMessage(chatId, "Si è verificato un errore durante il recupero dei dati. Riprova più tardi.");
        return;
      }
      const bmi = results[0].bmi;
      const dietAdvice = getDietAdvice(bmi);
      bot.sendMessage(chatId, dietAdvice);
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

// Funzione per fornire consigli dietetici basati sul BMI
function getDietAdvice(bmi) {
  let calories, protein, carbs, fats;

  if (bmi < 18.5) {
    calories = 2500;
    protein = 150;
    carbs = 300;
    fats = 80;
    return `Sei sotto peso. Ecco una dieta per aumentare la massa muscolare:
Calorie: ${calories} kcal
Proteine: ${protein} g
Carboidrati: ${carbs} g
Grassi: ${fats} g
Premi /logout per uscire.`;
  } else if (bmi < 24.9) {
    calories = 2000;
    protein = 120;
    carbs = 250;
    fats = 70;
    return `Hai un peso normale. Ecco una dieta equilibrata per mantenere il peso:
Calorie: ${calories} kcal
Proteine: ${protein} g
Carboidrati: ${carbs} g
Grassi: ${fats} g
Premi /logout per uscire.`;
  } else if (bmi < 29.9) {
    calories = 1800;
    protein = 130;
    carbs = 200;
    fats = 60;
    return `Sei in sovrappeso. Ecco una dieta per dimagrire:
Calorie: ${calories} kcal
Proteine: ${protein} g
Carboidrati: ${carbs} g
Grassi: ${fats} g
Premi /logout per uscire.`;
  } else {
    calories = 1500;
    protein = 140;
    carbs = 150;
    fats = 50;
    return `Sei obeso. Ecco una dieta per perdere peso:
Calorie: ${calories} kcal
Proteine: ${protein} g
Carboidrati: ${carbs} g
Grassi: ${fats} g
Premi /logout per uscire.`;
  }
}
