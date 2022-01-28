'use strict';

const readline = require('readline');

const socketioClient = require('socket.io-client');

const HOST = process.env.HOST || 'http://localhost:3000';
const NAMESPACE = process.env.NAMESPACE || '/socki-talki';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let clientName;
let roomName;

//  ======================== Socket Connection =======================

rl.question('What is your username ? ', (clientNameInput) => {
  rl.question('What room would you like to join ? ', (roomNameInput) => {
    clientName = clientNameInput;
    roomName = roomNameInput;
    // Call function to turn on server
    makeConnection();
  });
});


function makeConnection() {

  //  ======================== Socket Connection =======================

  const socket = socketioClient.connect(`${HOST}${NAMESPACE}`, {
    query: `CustomId=${clientName}`,
  });

  //  ======================== Client Functions ========================

  socket.on('connect', () => {
    // we will put all subscribe and all publish functions below

    socket.emit('join', roomName);

    rl.question(`What would you like to say: `, (response) => {
      socket.emit('message', response);
    });

    socket.on('message', message => {
      console.log(message);
    });

    socket.on('message-received', () => {
      rl.question(`Anything else? : `, (response) => {
        socket.emit('message', response);
      });
    });
  });
}


