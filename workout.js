// workout.js
const workouts = [
    { name: 'Push-ups', description: '3 serie da 15 ripetizioni', video: 'https://youtu.be/bND2SnO2oIY?si=OHd1elBUr6w6DnLO', muscle: 'pettorali' },
    { name: 'Squats', description: '3 serie da 20 ripetizioni', video: 'https://youtu.be/SVx2k8OZG48?si=1MDeVsJkU_6JxOuB', muscle: 'gambe' },
    { name: 'Plank', description: 'Stai per 1 minuto in posizione di plank', video: 'https://youtu.be/Is-7PPaBcsM?si=u8PieFkoMaCmfMMp', muscle: 'addominali' },
    
    // Aggiungi altri esercizi
  ];
  
  module.exports = {
    getRandomWorkout: function(bot, msg, muscle) {
      const chatId = msg.chat.id;
      
      // Filtra gli esercizi per il muscolo specificato
      const muscleWorkouts = workouts.filter(workout => workout.muscle.toLowerCase() === muscle.toLowerCase());
  
      // Controlla se ci sono esercizi disponibili per il muscolo specificato
      if (muscleWorkouts.length > 0) {
        // Seleziona casualmente un esercizio dalla lista filtrata
        const workout = muscleWorkouts[Math.floor(Math.random() * muscleWorkouts.length)];
  
        // Invia il messaggio con l'esercizio selezionato
        bot.sendMessage(chatId, `Oggi ti consiglio di fare: ${workout.name}\nDescrizione: ${workout.description}\nVideo: ${workout.video}`);
      } else {
        // Se non ci sono esercizi disponibili per il muscolo specificato, invia un messaggio di avviso
        bot.sendMessage(chatId, `Non ci sono esercizi disponibili per allenare il muscolo "${muscle}".`);
      }
    }
  };
  