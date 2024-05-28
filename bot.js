const TelegramBot = require('node-telegram-bot-api');
const workoutModule = require('./workout.js');
const Database = require('./database.js');

class TelegramBotHandler {
  constructor(token) {
    this.bot = new TelegramBot(token, { polling: true });
    this.db = new Database();

    this.bot.onText(/\/start/, this.handleStart.bind(this));
    this.bot.on('message', this.handleMessage.bind(this));
    this.bot.on('callback_query', this.handleCallbackQuery.bind(this));
  }

  handleStart(msg) {
    const chatId = msg.chat.id;
    this.db.insertOrUpdateUser(chatId, (err) => {
      if (err) {
        console.error('Errore durante l\'inserimento nel database:', err);
        return;
      }
      this.bot.sendMessage(chatId, "Benvenuto nel Coach di Fitness! Qual è il tuo nome?");
    });
  }

  handleMessage(msg) {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text.startsWith('/')) {
      return;
    }

    this.db.getUserByChatId(chatId, (err, user) => {
      if (err) {
        console.error('Errore durante la query:', err);
        return;
      }

      if (!user.name) {
        this.db.updateUserName(chatId, text, (err) => {
          if (err) {
            console.error('Errore durante l\'aggiornamento del database:', err);
            return;
          }
          this.bot.sendMessage(chatId, `Ciao ${text}! Quanti anni hai?`);
        });
      } else if (!user.age) {
        if (!isNaN(text)) {
          this.db.updateUserAge(chatId, text, (err) => {
            if (err) {
              console.error('Errore durante l\'aggiornamento del database:', err);
              return;
            }
            this.bot.sendMessage(chatId, `Perfetto! Hai ${text} anni. Quanto pesi (in kg)?`);
          });
        } else {
          this.bot.sendMessage(chatId, "Inserisci un numero valido per l'età.");
        }
      } else if (!user.weight) {
        if (!isNaN(text)) {
          this.db.updateUserWeight(chatId, text, (err) => {
            if (err) {
              console.error('Errore durante l\'aggiornamento del database:', err);
              return;
            }
            this.bot.sendMessage(chatId, `Ottimo! Pesi ${text} kg. Quanto sei alto (in cm)?`);
          });
        } else {
          this.bot.sendMessage(chatId, "Inserisci un numero valido per il peso.");
        }
      } else if (!user.height) {
        if (!isNaN(text)) {
          const height = parseFloat(text);
          const bmi = this.calculateBMI(user.weight, height);
          this.db.updateUserHeightAndBMI(chatId, text, bmi, (err) => {
            if (err) {
              console.error('Errore durante l\'aggiornamento del database:', err);
              return;
            }
            const advice = this.getAdvice(bmi);
            this.bot.sendMessage(chatId, `Sei alto ${text} cm. Il tuo BMI è ${bmi.toFixed(2)}. ${advice}`);
            this.askForGuidance(chatId);
          });
        } else {
          this.bot.sendMessage(chatId, "Inserisci un numero valido per l'altezza.");
        }
      }
    });
  }

  handleCallbackQuery(callbackQuery) {
    const action = callbackQuery.data;
    const chatId = callbackQuery.message.chat.id;

    if (action.startsWith('level_')) {
      const level = action.split('_')[1];
      this.db.updateUserLevel(chatId, level, (err) => {
        if (err) {
          console.error('Errore durante l\'aggiornamento del database:', err);
          return;
        }
        this.bot.sendMessage(chatId, `Hai selezionato il livello: ${level}`);
        this.sendMainMenu(chatId, level);
      });
    } else if (action.startsWith('category_')) {
      const parts = action.split('_');
      const category = parts[1];
      const level = parts[2];

      if (category === 'muscle') {
        this.sendMuscleSelection(chatId, level);
      } else if (category === 'cardio') {
        workoutModule.getCategoryWorkout(this.bot, { chat: { id: chatId } }, 'cardio', level);
      }
    } else if (action.startsWith('muscle_')) {
      const parts = action.split('_');
      const muscle = parts[1];
      const level = parts[2];
      workoutModule.getCategoryWorkout(this.bot, { chat: { id: chatId } }, muscle, level);
    } else if (action === 'guidance_workout') {
      this.askForLevel(chatId);
    } else if (action === 'guidance_diet') {
      this.db.getUserBMI(chatId, (err, bmi) => {
        if (err) {
          console.error('Errore durante la query:', err);
          return;
        }
        const dietAdvice = this.getDietAdvice(bmi);
        this.bot.sendMessage(chatId, dietAdvice);
      });
    }
  }

  calculateBMI(weight, height) {
    const weightInKg = parseFloat(weight);
    const heightInMeters = parseFloat(height) / 100;
    return weightInKg / (heightInMeters * heightInMeters);
  }

  getAdvice(bmi) {
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

  askForGuidance(chatId) {
    this.bot.sendMessage(chatId, "Cosa preferisci ricevere?", {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Consigli di Allenamento', callback_data: 'guidance_workout' }],
          [{ text: 'Consigli Dietetici', callback_data: 'guidance_diet' }]
        ]
      }
    });
  }

  askForLevel(chatId) {
    this.bot.sendMessage(chatId, "Qual è il tuo livello di fitness?", {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Principiante', callback_data: 'level_principiante' }],
          [{ text: 'Intermedio', callback_data: 'level_intermedio' }],
          [{ text: 'Avanzato', callback_data: 'level_avanzato' }]
        ]
      }
    });
  }

  sendMainMenu(chatId, level) {
    this.bot.sendMessage(chatId, "Scegli un'opzione:", {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Allenamento Muscolare', callback_data: `category_muscle_${level}` }],
          [{ text: 'Allenamento Dimagrimento/Cardio', callback_data: `category_cardio_${level}` }]
        ]
      }
    });
  }

  sendMuscleSelection(chatId, level) {
    this.bot.sendMessage(chatId, "Scegli il muscolo che desideri allenare:", {
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

  getDietAdvice(bmi) {
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
Grassi: ${fats} g`;
    } else if (bmi < 24.9) {
      calories = 2000;
      protein = 120;
      carbs = 250;
      fats = 70;
      return `Hai un peso normale. Ecco una dieta equilibrata per mantenere il peso:
Calorie: ${calories} kcal
Proteine: ${protein} g
Carboidrati: ${carbs} g
Grassi: ${fats} g`;
    } else if (bmi < 29.9) {
      calories = 1800;
      protein = 130;
      carbs = 200;
      fats = 60;
      return `Sei in sovrappeso. Ecco una dieta per dimagrire:
Calorie: ${calories} kcal
Proteine: ${protein} g
Carboidrati: ${carbs} g
Grassi: ${fats} g`;
    } else {
      calories = 1500;
      protein = 140;
      carbs = 150;
      fats = 50;
      return `Sei obeso. Ecco una dieta per perdere peso:
Calorie: ${calories} kcal
Proteine: ${protein} g
Carboidrati: ${carbs} g
Grassi: ${fats} g`;
    }
  }
}

module.exports = TelegramBotHandler;
