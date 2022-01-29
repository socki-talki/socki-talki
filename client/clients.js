'use strict';

const readline = require('readline');
const colors = require('colors');

const socketioClient = require('socket.io-client');

const HOST = process.env.HOST || 'http://localhost:3000';
const NAMESPACE = process.env.NAMESPACE || '/socki-talki';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let clientName, roomName; // these are assigned when the user inputs their info

//  ======================== Socket Connection =======================

rl.question('What is your username ? ', (clientNameInput) => {
  rl.question('What room would you like to join ? ', (roomNameInput) => {
    clientName = clientNameInput;
    roomName = roomNameInput;
    // Call function to connect to server
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

    rl.setPrompt('');

    socket.emit('join', roomName);

    socket.on('message', message => {
      console.log(colors.green(message));
    });

    // the line event is 'emit' when the user presses 'enter'

    rl.on('line', (message) => {
      if (message.toLowerCase().trim() === 'exit') {
        socket.close();
        process.exit();
      } else {
        socket.emit('message', { roomName, message: `${clientName}: ${message}` });
      }
    });

  });
}


