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

    console.log(`👽 ~ file: clients.js ~ line 44 ~ socket.on ~ roomName`, roomName);
    socket.emit('join', roomName);

    rl.setPrompt(`Message to ${roomName}: `);

    rl.prompt();
    // rl.question(`Message to ${roomName}: `, (message) => {
    //   socket.emit('message', { roomName, message });
    // });

    socket.on('message', message => {
      console.log(message);
    });

    socket.on('message-received', () => {
      rl.prompt();
    });

    rl.on('line', (message) => {
      if (message.toLowerCase().trim() === 'exit') {
        socket.close();
        process.exit();
      } else {
        // console.log(`👽 ~ file: clients.js ~ line 69 ~ rl.question ~ roomName`, roomName);
        socket.emit('message', { roomName, message });
      }
    });
    // socket.on('message', message => {
    //   console.log(message);
    // });

    // socket.on('message-received', () => {
    //   rl.question(`Anything else: `, (response) => {
    //     socket.emit('message', response);
    //   });
    // });

    // socket.on('message-received', () => {
    //   rl.question(`Message to ${roomName}: `, (message) => {
    //     if (message.toLowerCase().trim() === 'exit') {
    //       socket.close();
    //       process.exit();
    //     } else {
    //       // console.log(`👽 ~ file: clients.js ~ line 69 ~ rl.question ~ roomName`, roomName);
    //       socket.emit('message', { roomName, message });
    //     }
    //   });
    // });
  });
}


