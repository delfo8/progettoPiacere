const mysql = require('mysql2');

// Crea la connessione al database
const connection = mysql.createConnection({
  host: 'localhost', // Cambia se usi un host diverso
  user: 'root', // Cambia con il tuo utente MySQL
  password: '', 
  database: 'coachbot_db' // Il nome del tuo database
});

// Connetti al database
connection.connect((err) => {
  if (err) {
    console.error('Errore di connessione al database:', err);
    return;
  }
  console.log('Connesso al database MySQL');
});

module.exports = connection;
