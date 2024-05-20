const workouts = [
  { 
    name: 'Push-ups', 
    levels: {
      principiante: { description: '3 serie da 10 ripetizioni', video: 'https://youtu.be/bND2SnO2oIY?si=OHd1elBUr6w6DnLO' },
      intermedio: { description: '4 serie da 15 ripetizioni', video: 'https://youtu.be/bND2SnO2oIY?si=OHd1elBUr6w6DnLO' },
      avanzato: { description: '5 serie da 20 ripetizioni', video: 'https://youtu.be/bND2SnO2oIY?si=OHd1elBUr6w6DnLO' }
    },
    muscle: 'pettorali'
  },
  { 
    name: 'Squats', 
    levels: {
      principiante: { description: '3 serie da 15 ripetizioni', video: 'https://youtu.be/SVx2k8OZG48?si=1MDeVsJkU_6JxOuB' },
      intermedio: { description: '4 serie da 20 ripetizioni', video: 'https://youtu.be/SVx2k8OZG48?si=1MDeVsJkU_6JxOuB' },
      avanzato: { description: '5 serie da 25 ripetizioni', video: 'https://youtu.be/SVx2k8OZG48?si=1MDeVsJkU_6JxOuB' }
    },
    muscle: 'gambe'
  },
  { 
    name: 'Plank', 
    levels: {
      principiante: { description: '1 minuto', video: 'https://youtu.be/Is-7PPaBcsM?si=u8PieFkoMaCmfMMp' },
      intermedio: { description: '1.5 minuti', video: 'https://youtu.be/Is-7PPaBcsM?si=u8PieFkoMaCmfMMp' },
      avanzato: { description: '2 minuti', video: 'https://youtu.be/Is-7PPaBcsM?si=u8PieFkoMaCmfMMp' }
    },
    muscle: 'addominali'
  },
  { 
    name: 'Salti alla corda', 
    levels: {
      principiante: { description: '1 minuto', video: 'https://youtu.be/Is-7PPaBcsM?si=u8PieFkoMaCmfMMp' },
      intermedio: { description: '1.5 minuti', video: 'https://youtu.be/Is-7PPaBcsM?si=u8PieFkoMaCmfMMp' },
      avanzato: { description: '2 minuti', video: 'https://youtu.be/Is-7PPaBcsM?si=u8PieFkoMaCmfMMp' }
    },
    muscle: 'cardio'
  },
  { 
    name: 'Lat Machine', 
    levels: {
      principiante: { description: '3 serie da 15 ripetizioni', video: 'https://youtu.be/SVx2k8OZG48?si=1MDeVsJkU_6JxOuB' },
      intermedio: { description: '4 serie da 20 ripetizioni', video: 'https://youtu.be/SVx2k8OZG48?si=1MDeVsJkU_6JxOuB' },
      avanzato: { description: '5 serie da 25 ripetizioni', video: 'https://youtu.be/SVx2k8OZG48?si=1MDeVsJkU_6JxOuB' }
    },
    muscle: 'schiena'
  },
  // Aggiungi altri esercizi con diversi livelli
];

module.exports = {
  getRandomWorkout: function(bot, msg, level) {
    const chatId = msg.chat.id;
    const workout = workouts[Math.floor(Math.random() * workouts.length)];
    
    // Controlla se il livello è valido per l'esercizio selezionato
    if (workout.levels[level]) {
      const selectedLevel = workout.levels[level];
      bot.sendMessage(chatId, `Oggi ti consiglio di fare: ${workout.name}\nLivello: ${level}\nDescrizione: ${selectedLevel.description}\nVideo: ${selectedLevel.video}`);
    } else {
      bot.sendMessage(chatId, `Non ci sono esercizi disponibili per il livello "${level}".`);
    }
  },
  
  getCategoryWorkout: function(bot, msg, category, level) {
    const chatId = msg.chat.id;
    const categoryWorkouts = workouts.filter(workout => workout.muscle.toLowerCase() === category.toLowerCase());

    if (categoryWorkouts.length > 0) {
      const workout = categoryWorkouts[Math.floor(Math.random() * categoryWorkouts.length)];
      
      // Controlla se il livello è valido per l'esercizio selezionato
      if (workout.levels[level]) {
        const selectedLevel = workout.levels[level];
        bot.sendMessage(chatId, `Esercizio per ${category} - Livello: ${level}\nOggi ti consiglio di fare: ${workout.name}\nDescrizione: ${selectedLevel.description}\nVideo: ${selectedLevel.video}`);
      } else {
        bot.sendMessage(chatId, `Non ci sono esercizi disponibili per il livello "${level}" nella categoria "${category}".`);
      }
    } else {
      bot.sendMessage(chatId, `Non ci sono esercizi disponibili per la categoria "${category}".`);
    }
  }
};
