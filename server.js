const express = require('express');
const bodyParser = require('body-parser');

class Server {
  constructor() {
    this.app = express();
    this.app.use(bodyParser.json());
    this.port = process.env.PORT || 3000;

    this.app.get('/', (req, res) => {
      res.send('CoachBot è in esecuzione');
    });
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
}

module.exports = Server;
