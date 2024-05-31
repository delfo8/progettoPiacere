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
      principiante: { description: '3 serie da 15 ripetizioni', video: 'https://youtu.be/NL6Lqd6nU-g?si=HpxGLnuYF6gEJN3N' },
      intermedio: { description: '4 serie da 20 ripetizioni', video: 'https://youtu.be/NL6Lqd6nU-g?si=HpxGLnuYF6gEJN3N' },
      avanzato: { description: '5 serie da 25 ripetizioni', video: 'https://youtu.be/NL6Lqd6nU-g?si=HpxGLnuYF6gEJN3N' }
    },
    muscle: 'schiena'
  },
  { 
    name: 'Flessioni sulle parallele', 
    levels: {
      principiante: { description: '3 serie da 8 ripetizioni', video: 'https://www.youtube.com/watch?v=v44-R1l8ihc' },
      intermedio: { description: '4 serie da 12 ripetizioni', video: 'https://www.youtube.com/watch?v=v44-R1l8ihc' },
      avanzato: { description: '5 serie da 15 ripetizioni', video: 'https://www.youtube.com/watch?v=v44-R1l8ihc' }
    },
    muscle: 'pettorali'
  },
  { 
    name: 'Affondi', 
    levels: {
      principiante: { description: '3 serie da 10 ripetizioni per gamba', video: 'https://www.youtube.com/watch?v=-RlPvqfUj9E' },
      intermedio: { description: '4 serie da 12 ripetizioni per gamba', video: 'https://www.youtube.com/watch?v=-RlPvqfUj9E' },
      avanzato: { description: '5 serie da 15 ripetizioni per gamba', video: 'https://www.youtube.com/watch?v=-RlPvqfUj9E' }
    },
    muscle: 'gambe'
  },
  { 
    name: 'Crunch', 
    levels: {
      principiante: { description: '3 serie da 15 ripetizioni', video: 'https://www.youtube.com/watch?v=Xyd_fa5zoEU' },
      intermedio: { description: '4 serie da 20 ripetizioni', video: 'https://www.youtube.com/watch?v=Xyd_fa5zoEU' },
      avanzato: { description: '5 serie da 25 ripetizioni', video: 'https://www.youtube.com/watch?v=Xyd_fa5zoEU' }
    },
    muscle: 'addominali'
  },
  { 
    name: 'Burpees', 
    levels: {
      principiante: { description: '3 serie da 5 ripetizioni', video: 'https://www.youtube.com/watch?v=JZQA08SlJnM' },
      intermedio: { description: '4 serie da 8 ripetizioni', video: 'https://www.youtube.com/watch?v=JZQA08SlJnM' },
      avanzato: { description: '5 serie da 10 ripetizioni', video: 'https://www.youtube.com/watch?v=JZQA08SlJnM' }
    },
    muscle: 'cardio'
  },
  { 
    name: 'Trazioni alla sbarra', 
    levels: {
      principiante: { description: '3 serie da 5 ripetizioni', video: 'https://www.youtube.com/watch?v=bs_Ej32IYgo' },
      intermedio: { description: '4 serie da 8 ripetizioni', video: 'https://www.youtube.com/watch?v=bs_Ej32IYgo' },
      avanzato: { description: '5 serie da 10 ripetizioni', video: 'https://www.youtube.com/watch?v=bs_Ej32IYgo' }
    },
    muscle: 'schiena'
  },
  { 
    name: 'Dips', 
    levels: {
      principiante: { description: '3 serie da 8 ripetizioni', video: 'https://www.youtube.com/watch?v=2z8JmcrW-As' },
      intermedio: { description: '4 serie da 12 ripetizioni', video: 'https://www.youtube.com/watch?v=2z8JmcrW-As' },
      avanzato: { description: '5 serie da 15 ripetizioni', video: 'https://www.youtube.com/watch?v=2z8JmcrW-As' }
    },
    muscle: 'tricipiti'
  },
  { 
    name: 'Deadlift', 
    levels: {
      principiante: { description: '3 serie da 8 ripetizioni', video: 'https://www.youtube.com/watch?v=ytGaGIn3SjE' },
      intermedio: { description: '4 serie da 10 ripetizioni', video: 'https://www.youtube.com/watch?v=ytGaGIn3SjE' },
      avanzato: { description: '5 serie da 12 ripetizioni', video: 'https://www.youtube.com/watch?v=ytGaGIn3SjE' }
    },
    muscle: 'schiena e gambe'
  },
  { 
    name: 'Mountain Climbers', 
    levels: {
      principiante: { description: '3 serie da 30 secondi', video: 'https://www.youtube.com/watch?v=nmwgirgXLYM' },
      intermedio: { description: '4 serie da 45 secondi', video: 'https://www.youtube.com/watch?v=nmwgirgXLYM' },
      avanzato: { description: '5 serie da 60 secondi', video: 'https://www.youtube.com/watch?v=nmwgirgXLYM' }
    },
    muscle: 'addominali e cardio'
  },
  { 
    name: 'Leg Press', 
    levels: {
      principiante: { description: '3 serie da 12 ripetizioni', video: 'https://www.youtube.com/watch?v=Vk5jmfjdaLU' },
      intermedio: { description: '4 serie da 15 ripetizioni', video: 'https://www.youtube.com/watch?v=Vk5jmfjdaLU' },
      avanzato: { description: '5 serie da 20 ripetizioni', video: 'https://www.youtube.com/watch?v=Vk5jmfjdaLU' }
    },
    muscle: 'gambe'
  },
  { 
    name: 'Russian Twist', 
    levels: {
      principiante: { description: '3 serie da 12 ripetizioni per lato', video: 'https://www.youtube.com/watch?v=JB2oyawG9KI' },
      intermedio: { description: '4 serie da 15 ripetizioni per lato', video: 'https://www.youtube.com/watch?v=JB2oyawG9KI' },
      avanzato: { description: '5 serie da 20 ripetizioni per lato', video: 'https://www.youtube.com/watch?v=JB2oyawG9KI' }
    },
    muscle: 'addominali'
  }
  
  
];

module.exports = {
  getRandomWorkout: function(bot, msg, level) {
    const chatId = msg.chat.id;
    const workout = workouts[Math.floor(Math.random() * workouts.length)];
    
    // Controlla se il livello è valido per l'esercizio selezionato
    if (workout.levels[level]) {
      const selectedLevel = workout.levels[level];
      const message = `*Oggi ti consiglio di fare:* **${workout.name}**\n\n` +
                      `*Livello:* ${level}\n` +
                      `*Descrizione:* ${selectedLevel.description}\n` +
                      `[Guarda il video tutorial](${selectedLevel.video})`;
      bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
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
        const message = `*Esercizio per ${category} - Livello:* ${level}\n\n` +
                        `*Oggi ti consiglio di fare:* **${workout.name}**\n` +
                        `*Descrizione:* ${selectedLevel.description}\n` +
                        `[Guarda il video tutorial](${selectedLevel.video})`;
        bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
      } else {
        bot.sendMessage(chatId, `Non ci sono esercizi disponibili per il livello "${level}" nella categoria "${category}".`);
      }
    } else {
      bot.sendMessage(chatId, `Non ci sono esercizi disponibili per la categoria "${category}".`);
    }
  }
};