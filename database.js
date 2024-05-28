const mysql = require('mysql');

class Database {
  constructor() {
    this.connection = mysql.createConnection({
        host: 'localhost', // Cambia se usi un host diverso
        user: 'root', // Cambia con il tuo utente MySQL
        password: '', 
        database: 'coachbot_db' // Il nome del tuo database
    });
  }

  query(sql, args, callback) {
    this.connection.query(sql, args, callback);
  }

  insertOrUpdateUser(chatId, callback) {
    this.query('INSERT INTO users (chat_id) VALUES (?) ON DUPLICATE KEY UPDATE chat_id = chat_id', [chatId], callback);
  }

  getUserByChatId(chatId, callback) {
    this.query('SELECT * FROM users WHERE chat_id = ?', [chatId], (err, results) => {
      if (err) {
        callback(err);
      } else {
        callback(null, results[0]);
      }
    });
  }

  updateUserName(chatId, name, callback) {
    this.query('UPDATE users SET name = ? WHERE chat_id = ?', [name, chatId], callback);
  }

  updateUserAge(chatId, age, callback) {
    this.query('UPDATE users SET age = ? WHERE chat_id = ?', [age, chatId], callback);
  }

  updateUserWeight(chatId, weight, callback) {
    this.query('UPDATE users SET weight = ? WHERE chat_id = ?', [weight, chatId], callback);
  }

  updateUserHeightAndBMI(chatId, height, bmi, callback) {
    this.query('UPDATE users SET height = ?, bmi = ? WHERE chat_id = ?', [height, bmi, chatId], callback);
  }

  updateUserLevel(chatId, level, callback) {
    this.query('UPDATE users SET level = ? WHERE chat_id = ?', [level, chatId], callback);
  }

  getUserBMI(chatId, callback) {
    this.query('SELECT bmi FROM users WHERE chat_id = ?', [chatId], (err, results) => {
      if (err) {
        callback(err);
      } else {
        callback(null, results[0].bmi);
      }
    });
  }
}

module.exports = Database;
