// diet.js
const db = require('./db.js');

// Funzione per fornire consigli dietetici basati sul BMI
function getDietAdvice(bmi) {
  let calories, protein, carbs, fats;

  if (bmi < 18.5) {
    calories = 2500;
    protein = 150;
    carbs = 300;
    fats = 80;
    return `Sei sotto peso. Ecco una dieta per aumentare la massa muscolare, premere /logout per uscire:
Calorie: ${calories} kcal
Proteine: ${protein} g
Carboidrati: ${carbs} g
Grassi: ${fats} g`;
  } else if (bmi < 24.9) {
    calories = 2000;
    protein = 120;
    carbs = 250;
    fats = 70;
    return `Hai un peso normale. Ecco una dieta equilibrata per mantenere il peso, premere /logout per uscire:
Calorie: ${calories} kcal
Proteine: ${protein} g
Carboidrati: ${carbs} g
Grassi: ${fats} g`;
  } else if (bmi < 29.9) {
    calories = 1800;
    protein = 130;
    carbs = 200;
    fats = 60;
    return `Sei in sovrappeso. Ecco una dieta per dimagrire, premere /logout per uscire:
Calorie: ${calories} kcal
Proteine: ${protein} g
Carboidrati: ${carbs} g
Grassi: ${fats} g`;
  } else {
    calories = 1500;
    protein = 140;
    carbs = 150;
    fats = 50;
    return `Sei obeso. Ecco una dieta per perdere peso, premere /logout per uscire:
Calorie: ${calories} kcal
Proteine: ${protein} g
Carboidrati: ${carbs} g
Grassi: ${fats} g`;
  }
}

// Funzione per gestire la richiesta di consigli dietetici
function handleDietRequest(chatId, bot) {
  db.query('SELECT bmi FROM users WHERE chat_id = ?', [chatId], (err, results) => {
    if (err) {
      console.error('Errore durante la query:', err);
      bot.sendMessage(chatId, "Si è verificato un errore durante il recupero del BMI. Riprova più tardi.");
      return;
    }
    const bmi = results[0].bmi;
    const dietAdvice = getDietAdvice(bmi);
    bot.sendMessage(chatId, dietAdvice);
  });
}

// Esporta le funzioni necessarie
module.exports = {
  handleDietRequest
};
